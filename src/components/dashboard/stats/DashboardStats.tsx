import { useMemo } from "react";
import { StatCard } from "./StatCard";
import type { Goal } from "@/types/goals";

interface DashboardStatsProps {
  goals: Goal[];
}

export function DashboardStats({ goals }: DashboardStatsProps) {
  const stats = useMemo(() => {
    const total = goals.length;
    const completed = goals.filter(
      (g) => (g.current_progress / g.target_value) * 100 >= 100
    ).length;
    const inProgress = goals.filter((g) => {
      const progress = (g.current_progress / g.target_value) * 100;
      return progress > 0 && progress < 100;
    }).length;
    const avgProgress = Math.round(
      goals.reduce(
        (sum, g) => sum + (g.current_progress / g.target_value) * 100,
        0
      ) / goals.length
    );

    return { total, completed, inProgress, avgProgress };
  }, [goals]);

  if (goals.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
      <StatCard value={stats.total} label="Total Goals" />
      <StatCard value={stats.completed} label="Completed" />
      <StatCard value={stats.inProgress} label="In Progress" />
      <StatCard value={`${stats.avgProgress}%`} label="Avg Progress" />
    </div>
  );
}
