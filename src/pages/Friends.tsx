import { useState } from "react";
import { useUserConnections } from "@/hooks/useConnections";
import { useUsers } from "@/hooks/useUsers";
import { useGoals } from "@/hooks/useGoals";
import { useFriendsActions } from "@/hooks/useFriendsActions";
import { ConfirmDialog } from "@/components/common";
import {
  FriendsHeader,
  PendingRequestsSection,
  ConnectedFriendsSection,
  SentRequestsSection,
  AddFriendDialog,
} from "@/components/friends";

interface FriendsProps {
  userId: string;
}

export default function Friends({ userId }: FriendsProps) {
  const [addFriendOpen, setAddFriendOpen] = useState(false);

  const { data: connections = [] } = useUserConnections(userId);
  const { data: users = [] } = useUsers();
  const { data: goals = [] } = useGoals();

  const {
    confirmRemove,
    handleAccept,
    handleReject,
    handleRemove,
    confirmRemoveAction,
    closeConfirmDialog,
    isAccepting,
    isRejecting,
  } = useFriendsActions(userId);

  return (
    <div className="space-y-6">
      <FriendsHeader onAddFriend={() => setAddFriendOpen(true)} />

      <PendingRequestsSection
        connections={connections}
        users={users}
        currentUserId={userId}
        onAccept={handleAccept}
        onReject={handleReject}
        isAccepting={isAccepting}
        isRejecting={isRejecting}
      />

      <ConnectedFriendsSection
        connections={connections}
        users={users}
        goals={goals}
        currentUserId={userId}
        onRemove={handleRemove}
        onAddFriend={() => setAddFriendOpen(true)}
      />

      <SentRequestsSection
        connections={connections}
        users={users}
        currentUserId={userId}
      />

      <AddFriendDialog
        userId={userId}
        open={addFriendOpen}
        onOpenChange={setAddFriendOpen}
      />

      <ConfirmDialog
        open={confirmRemove.open}
        onOpenChange={closeConfirmDialog}
        title="Remove Friend"
        description={`Are you sure you want to remove ${confirmRemove.userName} from your friends? You can add them again later.`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmRemoveAction}
      />
    </div>
  );
}
