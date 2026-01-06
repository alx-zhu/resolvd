import type { Goal } from "@/types/goals";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { formatDeadline } from "@/lib/dates";

interface GoalCardGridViewProps {
  goal: Goal;
  percentage: number;
  onQuickLogClick: (e: React.MouseEvent) => void;
}

export function GoalCardGridView({
  goal,
  percentage,
  onQuickLogClick,
}: GoalCardGridViewProps) {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <h3 className="font-semibold text-base line-clamp-2 mb-3">
        {goal.title}
      </h3>

      {/* Progress */}
      <div className="space-y-3 mb-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">{percentage}%</span>
          <span className="text-sm text-muted-foreground">
            {goal.current_progress} / {goal.target_value} {goal.unit_label}
          </span>
        </div>
        <Progress value={percentage} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="size-3.5" />
          <span>{formatDeadline(goal.deadline)}</span>
        </div>
        <Button size="sm" variant="outline" onClick={onQuickLogClick}>
          <Plus className="size-3.5" />
          Log
        </Button>
      </div>
    </Card>
  );
}
