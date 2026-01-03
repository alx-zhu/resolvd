import { GoalFormDialog } from "./GoalFormDialog";

interface CreateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGoalDialog({
  open,
  onOpenChange,
}: CreateGoalDialogProps) {
  return (
    <GoalFormDialog mode="create" open={open} onOpenChange={onOpenChange} />
  );
}
