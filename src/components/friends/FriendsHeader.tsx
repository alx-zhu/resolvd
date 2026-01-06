import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface FriendsHeaderProps {
  onAddFriend: () => void;
}

export function FriendsHeader({ onAddFriend }: FriendsHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Friends</h2>
        <p className="text-muted-foreground">
          Connect with friends to share your progress
        </p>
      </div>
      <Button onClick={onAddFriend} size="lg">
        <UserPlus className="size-4" />
        Add Friend
      </Button>
    </div>
  );
}
