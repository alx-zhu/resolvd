import { useState, useMemo } from "react";
import { useFriendIds } from "@/hooks/useConnections";
import { useGoals } from "@/hooks/useGoals";
import { useLogs } from "@/hooks/useLogs";
import { useUsers } from "@/hooks/useUsers";
import { FeedItem } from "@/components/feed/FeedItem";
import { Label } from "@/components/ui/label";
import { detectMilestone } from "@/lib/milestones";
import { Trophy } from "lucide-react";

interface FeedProps {
  userId: string;
}

export default function Feed({ userId }: FeedProps) {
  const [showMilestonesOnly, setShowMilestonesOnly] = useState(false);

  const { data: friendIds = [] } = useFriendIds(userId);
  const { data: goals = [] } = useGoals();
  const { data: logs = [] } = useLogs();
  const { data: users = [] } = useUsers();

  // Get feed items (logs from friends' public goals)
  const feedItems = useMemo(() => {
    // Filter goals that belong to friends and are shared
    const friendGoals = goals.filter(
      (g) => friendIds.includes(g.user_id) && g.visibility === 1
    );

    // Get logs for those goals
    const friendLogs = logs.filter((log) =>
      friendGoals.some((g) => g.id === log.goal_id)
    );

    // Create feed items with all necessary data
    const items = friendLogs
      .map((log) => {
        const goal = friendGoals.find((g) => g.id === log.goal_id);
        const user = users.find((u) => u.id === goal?.user_id);

        if (!goal || !user) return null;

        // Get all logs for this goal to detect milestones
        const allLogsForGoal = logs
          .filter((l) => l.goal_id === goal.id)
          .sort(
            (a, b) =>
              new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime()
          );

        return {
          log,
          goal,
          user,
          allLogsForGoal,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    // Sort by most recent first
    const sorted = items.sort(
      (a, b) =>
        new Date(b.log.logged_at).getTime() -
        new Date(a.log.logged_at).getTime()
    );

    // Filter milestones only if enabled
    if (showMilestonesOnly) {
      return sorted.filter((item) => {
        const previousLogs = item.allLogsForGoal.filter(
          (l) =>
            new Date(l.logged_at).getTime() <
            new Date(item.log.logged_at).getTime()
        );
        const milestone = detectMilestone(
          previousLogs,
          item.log,
          item.goal.target_value
        );
        return milestone !== null;
      });
    }

    return sorted;
  }, [goals, logs, users, friendIds, showMilestonesOnly]);

  if (friendIds.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto space-y-4">
          <div className="size-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Trophy className="size-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">No Friends Yet</h3>
            <p className="text-muted-foreground">
              Connect with friends to see their progress and celebrate their
              achievements together!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Activity Feed</h2>
          <p className="text-muted-foreground">
            See what your friends are achieving
          </p>
        </div>

        {/* Milestone Filter */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="milestones-only"
            checked={showMilestonesOnly}
            onChange={(e) => setShowMilestonesOnly(e.target.checked)}
            className="size-4 rounded border-input"
          />
          <Label htmlFor="milestones-only" className="cursor-pointer">
            Milestones only
          </Label>
        </div>
      </div>

      {/* Feed */}
      {feedItems.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <div className="max-w-md mx-auto space-y-4">
            <p className="text-muted-foreground">
              {showMilestonesOnly
                ? "No milestone achievements to show yet. Your friends will appear here when they reach important milestones!"
                : "No activity to show yet. Your friends will appear here when they log progress on their goals!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {feedItems.map((item) => (
            <FeedItem
              key={item.log.id}
              log={item.log}
              goal={item.goal}
              user={item.user}
              allLogsForGoal={item.allLogsForGoal}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      {feedItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6">
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">{friendIds.length}</div>
            <div className="text-sm text-muted-foreground">Friends</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">
              {
                goals.filter(
                  (g) => friendIds.includes(g.user_id) && g.visibility === 1
                ).length
              }
            </div>
            <div className="text-sm text-muted-foreground">Shared Goals</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">{feedItems.length}</div>
            <div className="text-sm text-muted-foreground">
              Recent Activities
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
