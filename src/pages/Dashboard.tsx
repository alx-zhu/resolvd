import { useState } from "react";
import { useGoalsByUser } from "@/hooks/useGoals";
import { useGoalsFilters } from "@/hooks/useGoalsFilters";
import { useViewMode } from "@/hooks/useViewMode";
import { CreateGoalDialog } from "@/components/goals";
import {
  DashboardHeader,
  DashboardToolbar,
  EmptyState,
  GoalsList,
  type SortOption,
} from "@/components/dashboard";

interface DashboardProps {
  userId: string;
}

export default function Dashboard({ userId }: DashboardProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("created");

  const { data: goals = [], isLoading } = useGoalsByUser(userId);
  const { viewMode, toggleViewMode } = useViewMode();
  const filteredGoals = useGoalsFilters(goals, searchQuery, sortBy);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading your goals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader onCreateClick={() => setCreateOpen(true)} />

      <DashboardToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeToggle={toggleViewMode}
      />

      {filteredGoals.length === 0 ? (
        <EmptyState
          variant={searchQuery ? "no-results" : "no-goals"}
          searchQuery={searchQuery}
          onCreateClick={() => setCreateOpen(true)}
          onClearSearch={() => setSearchQuery("")}
        />
      ) : (
        <GoalsList goals={filteredGoals} viewMode={viewMode} />
      )}

      <CreateGoalDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
