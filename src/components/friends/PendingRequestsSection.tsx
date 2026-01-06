import { Separator } from "@/components/ui/separator";
import { PendingRequestCard } from "./PendingRequestCard";
import { SectionHeader } from "./SectionHeader";
import type { Connection, User } from "@/types/goals";

interface PendingRequestsSectionProps {
  connections: Connection[];
  users: User[];
  currentUserId: string;
  onAccept: (userId: string) => void;
  onReject: (userId: string) => void;
  isAccepting?: boolean;
  isRejecting?: boolean;
}

export function PendingRequestsSection({
  connections,
  users,
  currentUserId,
  onAccept,
  onReject,
  isAccepting = false,
  isRejecting = false,
}: PendingRequestsSectionProps) {
  const pendingReceived = connections.filter(
    (c) => c.status === "pending" && c.user_id_2 === currentUserId
  );

  if (pendingReceived.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-3">
        <SectionHeader
          title="Pending Requests"
          count={pendingReceived.length}
        />
        <div className="space-y-2">
          {pendingReceived.map((connection) => {
            const otherUser = users.find((u) => u.id === connection.user_id_1);
            if (!otherUser) return null;

            return (
              <PendingRequestCard
                key={connection.user_id_1}
                user={otherUser}
                onAccept={onAccept}
                onReject={onReject}
                isAccepting={isAccepting}
                isRejecting={isRejecting}
              />
            );
          })}
        </div>
        <Separator />
      </div>
    </>
  );
}
