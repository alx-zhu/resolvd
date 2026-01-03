import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Grid3x3, List } from "lucide-react";
import type { ViewMode } from "@/types/goals";

export type SortOption = "progress" | "deadline" | "created";

interface DashboardToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  viewMode: ViewMode;
  onViewModeToggle: () => void;
}

export function DashboardToolbar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeToggle,
}: DashboardToolbarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-50 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search goals..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
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
        onClick={onViewModeToggle}
        title={
          viewMode === "grid" ? "Switch to list view" : "Switch to grid view"
        }
      >
        {viewMode === "grid" ? (
          <List className="size-4" />
        ) : (
          <Grid3x3 className="size-4" />
        )}
      </Button>
    </div>
  );
}
