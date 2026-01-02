import type { User, Log, Goal } from "@/types/goals";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRelativeTime, formatDate } from "@/lib/dates";
import { detectMilestone, formatMilestone } from "@/lib/milestones";
import { TrendingUp } from "lucide-react";

interface FeedItemProps {
  log: Log;
  goal: Goal;
  user: User;
  allLogsForGoal: Log[];
}

export function FeedItem({ log, goal, user, allLogsForGoal }: FeedItemProps) {
  // Check if this log represents a milestone
  const milestone = detectMilestone(
    allLogsForGoal.filter(
      (l) => new Date(l.logged_at) < new Date(log.logged_at)
    ),
    log,
    goal.target_value
  );

  const progressPercentage = Math.round(
    (goal.current_progress / goal.target_value) * 100
  );

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* User Avatar */}
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium shrink-0">
          {user.name.charAt(0)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">{user.name}</span>
                <span className="text-muted-foreground">logged progress</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {getRelativeTime(log.logged_at)}
              </div>
            </div>
            {milestone && (
              <Badge variant="default" className="shrink-0">
                {formatMilestone(milestone)}
              </Badge>
            )}
          </div>

          {/* Goal Info */}
          <div className="rounded-lg bg-muted/50 p-3 space-y-2">
            <div className="font-medium">{goal.title}</div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="size-3.5 text-primary" />
                <span className="font-semibold">
                  +{log.value} {goal.unit_label}
                </span>
              </div>
              <div className="text-muted-foreground">
                {goal.current_progress} / {goal.target_value} {goal.unit_label}{" "}
                ({progressPercentage}%)
              </div>
            </div>
          </div>

          {/* Note */}
          {log.note && (
            <p className="text-sm text-muted-foreground">{log.note}</p>
          )}

          {/* Timestamp */}
          <div className="text-xs text-muted-foreground">
            {formatDate(log.logged_at, "MMM d, yyyy 'at' h:mm a")}
          </div>
        </div>
      </div>
    </Card>
  );
}
