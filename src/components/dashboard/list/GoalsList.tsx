import { GoalCard } from "@/components/goals";
import type { Goal, ViewMode } from "@/types/goals";

interface GoalsListProps {
  goals: Goal[];
  viewMode: ViewMode;
}

export function GoalsList({ goals, viewMode }: GoalsListProps) {
  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-3"
      }
    >
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} viewMode={viewMode} />
      ))}
    </div>
  );
}
