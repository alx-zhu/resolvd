import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateGoal, useUpdateGoal } from "@/hooks/useGoals";
import { useCurrentUser } from "@/hooks/useUsers";
import { Loader2, Lock, Users } from "lucide-react";
import { calculatePacing } from "@/lib/dates";
import type { Goal } from "@/types/goals";

interface GoalFormDialogProps {
  mode: "create" | "edit";
  goal?: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GoalFormDialog({
  mode,
  goal,
  open,
  onOpenChange,
}: GoalFormDialogProps) {
  const isEditMode = mode === "edit";

  // Initialize form state from goal in edit mode
  const [title, setTitle] = useState(() =>
    isEditMode && goal ? goal.title : ""
  );
  const [targetValue, setTargetValue] = useState(() =>
    isEditMode && goal ? goal.target_value.toString() : ""
  );
  const [unitLabel, setUnitLabel] = useState(() =>
    isEditMode && goal ? goal.unit_label || "" : ""
  );
  const [deadline, setDeadline] = useState(() =>
    isEditMode && goal
      ? new Date(goal.deadline).toISOString().split("T")[0]
      : ""
  );
  const [visibility, setVisibility] = useState<0 | 1>(() =>
    isEditMode && goal ? goal.visibility : 1
  );

  const { data: currentUser } = useCurrentUser();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();

  // Calculate pacing
  const currentProgress = isEditMode && goal ? goal.current_progress : 0;
  const pacing =
    targetValue && deadline
      ? calculatePacing(parseFloat(targetValue), currentProgress, deadline)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numValue = parseFloat(targetValue);
    if (isNaN(numValue) || numValue <= 0) return;

    try {
      if (isEditMode && goal) {
        // Update existing goal
        await updateGoal.mutateAsync({
          goalId: goal.id,
          updates: {
            title: title.trim(),
            target_value: numValue,
            unit_label: unitLabel.trim() || undefined,
            deadline: new Date(deadline).toISOString(),
            visibility,
          },
        });
      } else {
        // Create new goal
        if (!currentUser) return;

        await createGoal.mutateAsync({
          user_id: currentUser.id,
          title: title.trim(),
          target_value: numValue,
          unit_label: unitLabel.trim() || undefined,
          deadline: new Date(deadline).toISOString(),
          visibility,
        });

        // Reset form for create mode
        setTitle("");
        setTargetValue("");
        setUnitLabel("");
        setDeadline("");
        setVisibility(1);
      }

      onOpenChange(false);
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} goal:`,
        error
      );
    }
  };

  const isPending = isEditMode ? updateGoal.isPending : createGoal.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Goal" : "Create New Goal"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your goal details and settings"
              : "Set a new long-term goal to track your progress"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">What do you want to achieve?</Label>
              <Input
                id="title"
                placeholder="e.g., Run a marathon"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus={!isEditMode}
              />
            </div>

            {/* Target & Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">How many?</Label>
                <Input
                  id="target"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 42"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  placeholder="e.g., km"
                  value={unitLabel}
                  onChange={(e) => setUnitLabel(e.target.value)}
                />
              </div>
            </div>

            {/* Progress (edit mode only) */}
            {isEditMode && goal && (
              <div className="rounded-lg bg-muted p-3 text-sm">
                <div className="text-muted-foreground mb-1">
                  Current Progress
                </div>
                <div className="font-semibold">
                  {goal.current_progress} {goal.unit_label}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Progress cannot be edited directly. Use the log entries to
                  update progress.
                </div>
              </div>
            )}

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">By when?</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Pacing Display */}
            {pacing && pacing.daysLeft > 0 && (
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="text-sm font-medium">
                  {isEditMode ? "Remaining Pacing" : "Pacing"}
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Per day</div>
                    <div className="font-semibold">
                      {pacing.perDay} {unitLabel}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Per week</div>
                    <div className="font-semibold">
                      {pacing.perWeek} {unitLabel}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Per month</div>
                    <div className="font-semibold">
                      {pacing.perMonth} {unitLabel}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {pacing.daysLeft} days until deadline
                </div>
              </div>
            )}

            {/* Visibility */}
            <div className="space-y-2">
              <Label>Visibility</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={visibility === 0 ? "default" : "outline"}
                  onClick={() => setVisibility(0)}
                  className="flex-1"
                >
                  <Lock className="size-4" />
                  Private
                </Button>
                <Button
                  type="button"
                  variant={visibility === 1 ? "default" : "outline"}
                  onClick={() => setVisibility(1)}
                  className="flex-1"
                >
                  <Users className="size-4" />
                  Friends
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isEditMode ? "Save Changes" : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
