import type { Goal } from "@/types/goals";
import { useState } from "react";
import { Link } from "react-router-dom";
import { QuickLogDialog } from "../form/QuickLogDialog";
import { GoalCardListView } from "./GoalCardListView";
import { GoalCardGridView } from "./GoalCardGridView";

interface GoalCardProps {
  goal: Goal;
  viewMode: "grid" | "list";
}

export function GoalCard({ goal, viewMode }: GoalCardProps) {
  const [quickLogOpen, setQuickLogOpen] = useState(false);

  const percentage = Math.min(
    100,
    Math.round((goal.current_progress / goal.target_value) * 100)
  );

  const handleQuickLogClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickLogOpen(true);
  };

  const CardView = viewMode === "list" ? GoalCardListView : GoalCardGridView;

  return (
    <>
      <Link to={`/goals/${goal.id}`} className="block">
        <CardView
          goal={goal}
          percentage={percentage}
          onQuickLogClick={handleQuickLogClick}
        />
      </Link>

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
