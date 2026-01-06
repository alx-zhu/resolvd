import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGoals, useDeleteGoal } from "@/hooks/useGoals";
import { useLogsByGoal, useDeleteLog } from "@/hooks/useLogs";
import { formatDate, formatDeadline, getRelativeTime } from "@/lib/dates";
import { detectMilestone, formatMilestone } from "@/lib/milestones";
import { Calendar, Plus, Trash2, Edit, ArrowLeft } from "lucide-react";
import { QuickLogDialog } from "@/components/goals/form/QuickLogDialog";
import { EditLogDialog } from "@/components/goals/form/EditLogDialog";
import { EditGoalDialog } from "@/components/goals/form/EditGoalDialog";
import type { Log } from "@/types/goals";

interface GoalDetailProps {
  userId: string;
}

export default function GoalDetail({ userId }: GoalDetailProps) {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();

  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editLogOpen, setEditLogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  const { data: goals = [] } = useGoals();
  const { data: logs = [] } = useLogsByGoal(goalId || "");
  const deleteGoal = useDeleteGoal();
  const deleteLog = useDeleteLog();

  const goal = goals.find((g) => g.id === goalId);

  if (!goalId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Goal not found</p>
        <Link to="/">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading goal...</p>
      </div>
    );
  }

  // Check if user owns this goal
  const isOwner = goal.user_id === userId;

  if (!isOwner) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          You don't have permission to view this goal
        </p>
        <Link to="/">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const percentage = Math.min(
    100,
    Math.round((goal.current_progress / goal.target_value) * 100)
  );

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
  );

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this goal? All progress logs will also be deleted. This action cannot be undone."
      )
    ) {
      try {
        await deleteGoal.mutateAsync(goalId);
        navigate("/");
      } catch (error) {
        console.error("Failed to delete goal:", error);
      }
    }
  };

  const handleDeleteLog = async (logId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this log entry? This action cannot be undone."
      )
    ) {
      try {
        await deleteLog.mutateAsync({ logId, goalId });
      } catch (error) {
        console.error("Failed to delete log:", error);
      }
    }
  };

  const handleEditLog = (log: Log) => {
    setSelectedLog(log);
    setEditLogOpen(true);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold mb-2">{goal.title}</h1>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setEditOpen(true)}
            >
              <Edit className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDelete}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-bold">{percentage}%</span>
            <span className="text-lg text-muted-foreground">
              {goal.current_progress} / {goal.target_value} {goal.unit_label}
            </span>
          </div>
          <Progress value={percentage} className="h-4" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              <span>Due {formatDate(goal.deadline)}</span>
            </div>
            <span>{formatDeadline(goal.deadline)}</span>
          </div>
        </div>

        <Separator />

        {/* Quick Log Button */}
        <Button
          className="w-full"
          onClick={() => setQuickLogOpen(true)}
          size="lg"
        >
          <Plus className="size-4" />
          Log Progress
        </Button>

        <Separator />

        {/* Progress History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Progress History</h2>
            <Badge variant="secondary">{logs.length} entries</Badge>
          </div>

          {sortedLogs.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">
                No progress logged yet. Start by logging your first entry!
              </p>
              <Button onClick={() => setQuickLogOpen(true)}>
                <Plus className="size-4" />
                Log Your First Entry
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedLogs.map((log, index) => {
                const milestone = detectMilestone(
                  sortedLogs.slice(index + 1),
                  log,
                  goal.target_value
                );

                return (
                  <div
                    key={log.id}
                    className="rounded-lg border p-4 space-y-2 hover:bg-accent/50 transition-colors"
                  >
                    {milestone && (
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        {formatMilestone(milestone)}
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-lg">
                            +{log.value} {goal.unit_label}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {getRelativeTime(log.logged_at)}
                          </span>
                        </div>
                        {log.note && (
                          <p className="text-sm text-muted-foreground">
                            {log.note}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDate(log.logged_at, "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEditLog(log)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDeleteLog(log.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <QuickLogDialog
        goalId={goalId}
        goalTitle={goal.title}
        unitLabel={goal.unit_label}
        open={quickLogOpen}
        onOpenChange={setQuickLogOpen}
      />

      <EditLogDialog
        log={selectedLog}
        goalId={goalId}
        unitLabel={goal.unit_label}
        open={editLogOpen}
        onOpenChange={setEditLogOpen}
      />

      <EditGoalDialog goal={goal} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
