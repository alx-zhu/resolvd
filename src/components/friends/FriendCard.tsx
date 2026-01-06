import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/common";
import { Target } from "lucide-react";
import type { User } from "@/types/goals";

interface FriendCardProps {
  user: User;
  goalCount: number;
  onRemove: (userId: string, userName: string) => void;
}

export function FriendCard({ user, goalCount, onRemove }: FriendCardProps) {
  return (
    <Card className="p-5">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <UserAvatar name={user.name} size="lg" className="size-14 text-lg" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-lg">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Target className="size-4 text-muted-foreground" />
            <span className="font-medium">{goalCount}</span>
            <span className="text-muted-foreground">
              active {goalCount === 1 ? "goal" : "goals"}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(user.id, user.name)}
          className="w-full"
        >
          Remove Friend
        </Button>
      </div>
    </Card>
  );
}
