import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types/goals";

interface SentRequestCardProps {
  user: User;
}

export function SentRequestCard({ user }: SentRequestCardProps) {
  return (
    <Card className="p-4 opacity-60">
      <div className="flex items-center gap-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium shrink-0">
          {user.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
        <Badge variant="outline">Pending</Badge>
      </div>
    </Card>
  );
}
