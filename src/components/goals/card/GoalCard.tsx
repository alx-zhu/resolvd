import type { Goal } from "@/types/goals";
import { useState } from "react";
import { GoalDetailDialog } from "../detail/GoalDetailDialog";
import { QuickLogDialog } from "../form/QuickLogDialog";
import { GoalCardListView } from "./GoalCardListView";
import { GoalCardGridView } from "./GoalCardGridView";

interface GoalCardProps {
  goal: Goal;
  viewMode: "grid" | "list";
}

export function GoalCard({ goal, viewMode }: GoalCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [quickLogOpen, setQuickLogOpen] = useState(false);

  const percentage = Math.min(
    100,
    Math.round((goal.current_progress / goal.target_value) * 100)
  );

  const handleCardClick = () => setDetailOpen(true);

  const handleQuickLogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickLogOpen(true);
  };

  const CardView = viewMode === "list" ? GoalCardListView : GoalCardGridView;

  return (
    <>
      <CardView
        goal={goal}
        percentage={percentage}
        onCardClick={handleCardClick}
        onQuickLogClick={handleQuickLogClick}
      />

      <GoalDetailDialog
        goalId={goal.id}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
      <QuickLogDialog
        goalId={goal.id}
        goalTitle={goal.title}
        unitLabel={goal.unit_label}
        open={quickLogOpen}
        onOpenChange={setQuickLogOpen}
      />
    </>
  );
}
