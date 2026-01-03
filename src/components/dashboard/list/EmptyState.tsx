import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  variant: "no-goals" | "no-results";
  searchQuery?: string;
  onCreateClick?: () => void;
  onClearSearch?: () => void;
}

export function EmptyState({
  variant,
  searchQuery,
  onCreateClick,
  onClearSearch,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 border-2 border-dashed rounded-lg">
      <div className="max-w-sm mx-auto space-y-4">
        {variant === "no-results" ? (
          <>
            <p className="text-muted-foreground">
              No goals found matching "{searchQuery}"
            </p>
            <Button variant="outline" onClick={onClearSearch}>
              Clear Search
            </Button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground">
              You haven't created any goals yet. Start by creating your first
              goal!
            </p>
            <Button onClick={onCreateClick}>
              <Plus className="size-4" />
              Create Your First Goal
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
