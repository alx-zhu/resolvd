import type { Goal } from "@/types/goals";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Calendar, Lock, Users } from "lucide-react";
import { formatDeadline } from "@/lib/dates";
import { useState } from "react";
import { GoalDetailDialog } from "./GoalDetailDialog";
import { QuickLogDialog } from "./QuickLogDialog";

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
  const remaining = Math.max(0, goal.target_value - goal.current_progress);

  if (viewMode === "list") {
    return (
      <>
        <Card
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setDetailOpen(true)}
        >
          <div className="flex items-center gap-4">
            {/* Progress Circle */}
            <div className="relative flex items-center justify-center size-16 shrink-0">
              <svg className="size-16 -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 28 * (1 - percentage / 100)
                  }`}
                  className="text-primary transition-all"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-sm font-semibold">
                {percentage}%
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-base truncate">
                  {goal.title}
                </h3>
                <div className="flex items-center gap-2 shrink-0">
                  {goal.visibility === 0 ? (
                    <Lock className="size-3.5 text-muted-foreground" />
                  ) : (
                    <Users className="size-3.5 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {goal.current_progress} / {goal.target_value}{" "}
                  {goal.unit_label}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  {formatDeadline(goal.deadline)}
                </span>
              </div>
            </div>

            {/* Quick Add Button */}
            <Button
              size="icon-sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setQuickLogOpen(true);
              }}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </Card>

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

  // Grid view
  return (
    <>
      <Card
        className="p-5 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setDetailOpen(true)}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-base line-clamp-2 flex-1">
            {goal.title}
          </h3>
          {goal.visibility === 0 ? (
            <Lock className="size-4 text-muted-foreground shrink-0" />
          ) : (
            <Users className="size-4 text-muted-foreground shrink-0" />
          )}
        </div>

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
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setQuickLogOpen(true);
            }}
          >
            <Plus className="size-3.5" />
            Log
          </Button>
        </div>
      </Card>

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
