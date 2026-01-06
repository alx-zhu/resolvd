import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users as UsersIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Card className="p-8">
      <div className="text-center space-y-4">
        <div className="size-16 mx-auto rounded-full bg-muted flex items-center justify-center">
          {icon || <UsersIcon className="size-8 text-muted-foreground" />}
        </div>
        <div>
          <h4 className="font-semibold mb-2">{title}</h4>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          {actionLabel && onAction && (
            <Button onClick={onAction}>
              <UserPlus className="size-4" />
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
