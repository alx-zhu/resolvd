import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGoals, useDeleteGoal } from "@/hooks/useGoals";
import { useLogsByGoal, useDeleteLog, useUpdateLog } from "@/hooks/useLogs";
import { formatDate, formatDeadline, getRelativeTime } from "@/lib/dates";
import { detectMilestone, formatMilestone } from "@/lib/milestones";
import {
  Calendar,
  Plus,
  Trash2,
  Lock,
  Users,
  Edit,
  Check,
  X,
} from "lucide-react";
import { QuickLogDialog } from "../form/QuickLogDialog";
import { EditGoalDialog } from "../form/EditGoalDialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface GoalDetailDialogProps {
  goalId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GoalDetailDialog({
  goalId,
  open,
  onOpenChange,
}: GoalDetailDialogProps) {
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editNote, setEditNote] = useState("");

  const { data: goals = [] } = useGoals();
  const { data: logs = [] } = useLogsByGoal(goalId);
  const deleteGoal = useDeleteGoal();
  const deleteLog = useDeleteLog();
  const updateLog = useUpdateLog();

  const goal = goals.find((g) => g.id === goalId);

  if (!goal) return null;

  const percentage = Math.min(
    100,
    Math.round((goal.current_progress / goal.target_value) * 100)
  );

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
  );

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this goal? All progress logs will also be deleted."
      )
    )
      return;

    try {
      await deleteGoal.mutateAsync(goalId);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete goal:", error);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    if (!confirm("Are you sure you want to delete this log entry?")) return;

    try {
      await deleteLog.mutateAsync({ logId, goalId });
    } catch (error) {
      console.error("Failed to delete log:", error);
    }
  };

  const handleStartEdit = (log: (typeof logs)[0]) => {
    setEditingLogId(log.id);
    setEditValue(log.value.toString());
    setEditNote(log.note || "");
  };

  const handleCancelEdit = () => {
    setEditingLogId(null);
    setEditValue("");
    setEditNote("");
  };

  const handleSaveEdit = async (logId: string) => {
    const value = parseFloat(editValue);
    if (isNaN(value) || value <= 0) {
      alert("Please enter a valid positive number");
      return;
    }

    try {
      await updateLog.mutateAsync({
        logId,
        goalId,
        updates: {
          value,
          note: editNote.trim() || undefined,
        },
      });
      handleCancelEdit();
    } catch (error) {
      console.error("Failed to update log:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-2xl">{goal.title}</DialogTitle>
                <DialogDescription className="mt-2 flex items-center gap-2">
                  {goal.visibility === 0 ? (
                    <>
                      <Lock className="size-3.5" />
                      <span>Private</span>
                    </>
                  ) : (
                    <>
                      <Users className="size-3.5" />
                      <span>Shared with friends</span>
                    </>
                  )}
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setEditOpen(true)}
                >
                  <Edit className="size-4" />
                </Button>
                <Button variant="outline" size="icon-sm" onClick={handleDelete}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Progress Overview */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{percentage}%</span>
                <span className="text-muted-foreground">
                  {goal.current_progress} / {goal.target_value}{" "}
                  {goal.unit_label}
                </span>
              </div>
              <Progress value={percentage} className="h-3" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Progress History</h3>
                <Badge variant="secondary">{logs.length} entries</Badge>
              </div>

              {sortedLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No progress logged yet. Start by logging your first entry!
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedLogs.map((log, index) => {
                    // Check for milestone
                    const milestone = detectMilestone(
                      sortedLogs.slice(index + 1),
                      log,
                      goal.target_value
                    );

                    const isEditing = editingLogId === log.id;

                    return (
                      <div
                        key={log.id}
                        className="rounded-lg border p-3 space-y-2"
                      >
                        {milestone && (
                          <div className="flex items-center gap-2 text-sm font-medium text-primary">
                            {formatMilestone(milestone)}
                          </div>
                        )}

                        {isEditing ? (
                          // Edit mode
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Label className="min-w-fit">Value:</Label>
                                  <Input
                                    type="number"
                                    value={editValue}
                                    onChange={(e) =>
                                      setEditValue(e.target.value)
                                    }
                                    placeholder="Enter value"
                                    className="flex-1"
                                    min="0"
                                    step="any"
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    {goal.unit_label}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <Label>Note (optional):</Label>
                                  <Textarea
                                    value={editNote}
                                    onChange={(e) =>
                                      setEditNote(e.target.value)
                                    }
                                    placeholder="Add a note..."
                                    className="min-h-15 resize-none"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEdit}
                              >
                                <X className="size-3.5 mr-1" />
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSaveEdit(log.id)}
                                disabled={updateLog.isPending}
                              >
                                <Check className="size-3.5 mr-1" />
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // View mode
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">
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
                                {formatDate(
                                  log.logged_at,
                                  "MMM d, yyyy 'at' h:mm a"
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleStartEdit(log)}
                              >
                                <Edit className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleDeleteLog(log.id)}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <QuickLogDialog
        goalId={goalId}
        goalTitle={goal.title}
        unitLabel={goal.unit_label}
        open={quickLogOpen}
        onOpenChange={setQuickLogOpen}
      />

      <EditGoalDialog goal={goal} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
