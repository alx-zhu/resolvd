import type { Goal } from "@/types/goals";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { formatDeadline } from "@/lib/dates";
import { ProgressCircle, VisibilityIcon } from "../../common";

interface GoalCardListViewProps {
  goal: Goal;
  percentage: number;
  onQuickLogClick: (e: React.MouseEvent) => void;
}

export function GoalCardListView({
  goal,
  percentage,
  onQuickLogClick,
}: GoalCardListViewProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Progress Circle */}
        <ProgressCircle percentage={percentage} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-base truncate">{goal.title}</h3>
            <div className="flex items-center gap-2 shrink-0">
              <VisibilityIcon visibility={goal.visibility} />
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {goal.current_progress} / {goal.target_value} {goal.unit_label}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {formatDeadline(goal.deadline)}
            </span>
          </div>
        </div>

        {/* Quick Add Button */}
        <Button size="icon-sm" variant="outline" onClick={onQuickLogClick}>
          <Plus className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
