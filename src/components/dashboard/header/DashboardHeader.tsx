import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  onCreateClick: () => void;
}

export function DashboardHeader({ onCreateClick }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Goals</h2>
        <p className="text-muted-foreground">
          Track your progress toward your long-term goals
        </p>
      </div>
      <Button onClick={onCreateClick} size="lg">
        <Plus className="size-4" />
        New Goal
      </Button>
    </div>
  );
}
