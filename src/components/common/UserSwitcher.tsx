import { useCurrentUser, useCurrentUserId, useUsers } from "@/hooks/useUsers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "./UserAvatar";

export function UserSwitcher() {
  const { data: currentUser } = useCurrentUser();
  const { data: users = [] } = useUsers();
  const { switchUser } = useCurrentUserId();

  if (!currentUser) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <User className="size-4" />
          <span className="hidden sm:inline">{currentUser.name}</span>
          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="end">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          Switch User (Dev Mode)
        </div>
        <Separator className="my-2" />
        <div className="space-y-1">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => switchUser(user.id)}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-sm text-sm transition-colors ${
                user.id === currentUser.id
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              }`}
            >
              <UserAvatar name={user.name} size="sm" />
              <div className="flex-1 text-left">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {user.email}
                </div>
              </div>
              {user.id === currentUser.id && (
                <div className="size-2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
