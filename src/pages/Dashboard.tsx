import { useState, useMemo } from "react";
import { useGoalsByUser } from "@/hooks/useGoals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoalCard } from "@/components/goals/GoalCard";
import { CreateGoalDialog } from "@/components/goals/CreateGoalDialog";
import { Plus, Search, Grid3x3, List, SortAsc } from "lucide-react";
import type { ViewMode } from "@/types/goals";

interface DashboardProps {
  userId: string;
}

export default function Dashboard({ userId }: DashboardProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem("goals-view-mode");
    return (saved as ViewMode) || "grid";
  });
  const [sortBy, setSortBy] = useState<"progress" | "deadline" | "created">(
    "created"
  );

  const { data: goals = [], isLoading } = useGoalsByUser(userId);

  // Toggle view mode and save to localStorage
  const toggleViewMode = () => {
    const newMode: ViewMode = viewMode === "grid" ? "list" : "grid";
    setViewMode(newMode);
    localStorage.setItem("goals-view-mode", newMode);
  };

  // Filter and sort goals
  const filteredGoals = useMemo(() => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading your goals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Goals</h2>
          <p className="text-muted-foreground">
            Track your progress toward your long-term goals
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} size="lg">
          <Plus className="size-4" />
          New Goal
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "progress" | "deadline" | "created")
          }
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="created">Recently Created</option>
          <option value="progress">Most Progress</option>
          <option value="deadline">Soonest Deadline</option>
        </select>

        {/* View Mode Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleViewMode}
          title={viewMode === "grid" ? "Switch to list view" : "Switch to grid view"}
        >
          {viewMode === "grid" ? (
            <List className="size-4" />
          ) : (
            <Grid3x3 className="size-4" />
          )}
        </Button>
      </div>

      {/* Goals Grid/List */}
      {filteredGoals.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <div className="max-w-sm mx-auto space-y-4">
            {searchQuery ? (
              <>
                <p className="text-muted-foreground">
                  No goals found matching "{searchQuery}"
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">
                  You haven't created any goals yet. Start by creating your first
                  goal!
                </p>
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="size-4" />
                  Create Your First Goal
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {filteredGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* Stats */}
      {goals.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">{goals.length}</div>
            <div className="text-sm text-muted-foreground">Total Goals</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">
              {goals.filter((g) => (g.current_progress / g.target_value) * 100 >= 100).length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">
              {goals.filter((g) => {
                const progress = (g.current_progress / g.target_value) * 100;
                return progress > 0 && progress < 100;
              }).length}
            </div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">
              {Math.round(
                goals.reduce(
                  (sum, g) => sum + (g.current_progress / g.target_value) * 100,
                  0
                ) / goals.length
              )}
              %
            </div>
            <div className="text-sm text-muted-foreground">Avg Progress</div>
          </div>
        </div>
      )}

      <CreateGoalDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
