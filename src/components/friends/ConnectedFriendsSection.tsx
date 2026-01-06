import { FriendCard } from "./FriendCard";
import { EmptyState } from "./EmptyState";
import { SectionHeader } from "./SectionHeader";
import { Users as UsersIcon } from "lucide-react";
import type { Connection, User, Goal } from "@/types/goals";

interface ConnectedFriendsSectionProps {
  connections: Connection[];
  users: User[];
  goals: Goal[];
  currentUserId: string;
  onRemove: (userId: string, userName: string) => void;
  onAddFriend: () => void;
}

export function ConnectedFriendsSection({
  connections,
  users,
  goals,
  currentUserId,
  onRemove,
  onAddFriend,
}: ConnectedFriendsSectionProps) {
  const acceptedConnections = connections.filter(
    (c) => c.status === "accepted"
  );

  return (
    <div className="space-y-3">
      <SectionHeader title="Connected" count={acceptedConnections.length} />

      {acceptedConnections.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="size-8 text-muted-foreground" />}
          title="No Friends Yet"
          description="Add friends to see their goals and celebrate achievements together"
          actionLabel="Add Your First Friend"
          onAction={onAddFriend}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {acceptedConnections.map((connection) => {
            const otherUserId =
              connection.user_id_1 === currentUserId
                ? connection.user_id_2
                : connection.user_id_1;
            const otherUser = users.find((u) => u.id === otherUserId);

            if (!otherUser) return null;

            // Count their shared goals
            const sharedGoals = goals.filter(
              (g) => g.user_id === otherUserId && g.visibility === 1
            );

            return (
              <FriendCard
                key={otherUserId}
                user={otherUser}
                goalCount={sharedGoals.length}
                onRemove={onRemove}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
