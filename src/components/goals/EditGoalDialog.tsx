import { useState, useEffect } from "react";
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
import { useUpdateGoal } from "@/hooks/useGoals";
import { Loader2, Lock, Users } from "lucide-react";
import { calculatePacing } from "@/lib/dates";
import type { Goal } from "@/types/goals";

interface EditGoalDialogProps {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditGoalDialog({
  goal,
  open,
  onOpenChange,
}: EditGoalDialogProps) {
  const [title, setTitle] = useState(goal.title);
  const [targetValue, setTargetValue] = useState(goal.target_value.toString());
  const [unitLabel, setUnitLabel] = useState(goal.unit_label || "");
  const [deadline, setDeadline] = useState(
    new Date(goal.deadline).toISOString().split("T")[0]
  );
  const [visibility, setVisibility] = useState<0 | 1>(goal.visibility);

  const updateGoal = useUpdateGoal();

  // Update form when goal changes
  useEffect(() => {
    setTitle(goal.title);
    setTargetValue(goal.target_value.toString());
    setUnitLabel(goal.unit_label || "");
    setDeadline(new Date(goal.deadline).toISOString().split("T")[0]);
    setVisibility(goal.visibility);
  }, [goal]);

  // Calculate pacing
  const pacing =
    targetValue && deadline
      ? calculatePacing(
          parseFloat(targetValue),
          goal.current_progress,
          deadline
        )
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numValue = parseFloat(targetValue);
    if (isNaN(numValue) || numValue <= 0) return;

    try {
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

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update goal:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
          <DialogDescription>
            Update your goal details and settings
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

            {/* Progress (read-only) */}
            <div className="rounded-lg bg-muted p-3 text-sm">
              <div className="text-muted-foreground mb-1">Current Progress</div>
              <div className="font-semibold">
                {goal.current_progress} {goal.unit_label}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Progress cannot be edited directly. Use the log entries to
                update progress.
              </div>
            </div>

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
                <div className="text-sm font-medium">Remaining Pacing</div>
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
              disabled={updateGoal.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateGoal.isPending}>
              {updateGoal.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
