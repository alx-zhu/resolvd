import { useMemo } from "react";
import type { Goal } from "@/types/goals";
import type { SortOption } from "@/components/dashboard/toolbar";

export function useGoalsFilters(
  goals: Goal[],
  searchQuery: string,
  sortBy: SortOption
) {
  return useMemo(() => {
    let filtered = goals;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (goal) =>
          goal.title.toLowerCase().includes(query) ||
          goal.unit_label?.toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "progress": {
          const progressA = (a.current_progress / a.target_value) * 100;
          const progressB = (b.current_progress / b.target_value) * 100;
          return progressB - progressA;
        }
        case "deadline":
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        case "created":
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });

    return sorted;
  }, [goals, searchQuery, sortBy]);
}
