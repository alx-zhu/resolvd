import { GoalFormDialog } from "./GoalFormDialog";
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
  return (
    <GoalFormDialog
      mode="edit"
      goal={goal}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
