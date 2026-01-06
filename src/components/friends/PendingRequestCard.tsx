import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/common";
import { Check, X } from "lucide-react";
import type { User } from "@/types/goals";

interface PendingRequestCardProps {
  user: User;
  onAccept: (userId: string) => void;
  onReject: (userId: string) => void;
  isAccepting?: boolean;
  isRejecting?: boolean;
}

export function PendingRequestCard({
  user,
  onAccept,
  onReject,
  isAccepting = false,
  isRejecting = false,
}: PendingRequestCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <UserAvatar name={user.name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => onAccept(user.id)}
            disabled={isAccepting}
          >
            <Check className="size-4" />
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(user.id)}
            disabled={isRejecting}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
