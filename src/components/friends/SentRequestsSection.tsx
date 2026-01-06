import { Separator } from "@/components/ui/separator";
import { SentRequestCard } from "./SentRequestCard";
import { SectionHeader } from "./SectionHeader";
import type { Connection, User } from "@/types/goals";

interface SentRequestsSectionProps {
  connections: Connection[];
  users: User[];
  currentUserId: string;
}

export function SentRequestsSection({
  connections,
  users,
  currentUserId,
}: SentRequestsSectionProps) {
  const pendingSent = connections.filter(
    (c) => c.status === "pending" && c.user_id_1 === currentUserId
  );

  if (pendingSent.length === 0) {
    return null;
  }

  return (
    <>
      <Separator />
      <div className="space-y-3">
        <SectionHeader
          title="Pending (Sent)"
          count={pendingSent.length}
          variant="outline"
        />
        <div className="space-y-2">
          {pendingSent.map((connection) => {
            const otherUser = users.find((u) => u.id === connection.user_id_2);
            if (!otherUser) return null;

            return (
              <SentRequestCard key={connection.user_id_2} user={otherUser} />
            );
          })}
        </div>
      </div>
    </>
  );
}
