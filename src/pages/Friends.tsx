import { useState } from "react";
import { useUserConnections } from "@/hooks/useConnections";
import { useUsers } from "@/hooks/useUsers";
import { useGoals } from "@/hooks/useGoals";
import {
  useAcceptConnection,
  useDeleteConnection,
} from "@/hooks/useConnections";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AddFriendDialog } from "@/components/friends/AddFriendDialog";
import { UserPlus, Check, X, Users as UsersIcon, Target } from "lucide-react";
import { UserAvatar, ConfirmDialog } from "@/components/common";

interface FriendsProps {
  userId: string;
}

export default function Friends({ userId }: FriendsProps) {
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<{
    open: boolean;
    userId: string;
    userName: string;
  }>({ open: false, userId: "", userName: "" });

  const { data: connections = [] } = useUserConnections(userId);
  const { data: users = [] } = useUsers();
  const { data: goals = [] } = useGoals();
  const acceptConnection = useAcceptConnection();
  const deleteConnection = useDeleteConnection();

  // Separate pending and accepted connections
  const pendingReceived = connections.filter(
    (c) => c.status === "pending" && c.user_id_2 === userId
  );
  const pendingSent = connections.filter(
    (c) => c.status === "pending" && c.user_id_1 === userId
  );
  const acceptedConnections = connections.filter(
    (c) => c.status === "accepted"
  );

  const handleAccept = async (connectionUserId: string) => {
    try {
      await acceptConnection.mutateAsync({
        userId1: userId,
        userId2: connectionUserId,
      });
    } catch (error) {
      console.error("Failed to accept connection:", error);
    }
  };

  const handleReject = async (connectionUserId: string) => {
    try {
      await deleteConnection.mutateAsync({
        userId1: userId,
        userId2: connectionUserId,
      });
    } catch (error) {
      console.error("Failed to reject connection:", error);
    }
  };

  const handleRemove = async (connectionUserId: string, userName: string) => {
    setConfirmRemove({ open: true, userId: connectionUserId, userName });
  };

  const confirmRemoveAction = async () => {
    try {
      await deleteConnection.mutateAsync({
        userId1: userId,
        userId2: confirmRemove.userId,
      });
    } catch (error) {
      console.error("Failed to remove friend:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Friends</h2>
          <p className="text-muted-foreground">
            Connect with friends to share your progress
          </p>
        </div>
        <Button onClick={() => setAddFriendOpen(true)} size="lg">
          <UserPlus className="size-4" />
          Add Friend
        </Button>
      </div>

      {/* Pending Requests */}
      {pendingReceived.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Pending Requests</h3>
            <Badge variant="secondary">{pendingReceived.length}</Badge>
          </div>
          <div className="space-y-2">
            {pendingReceived.map((connection) => {
              const otherUser = users.find(
                (u) => u.id === connection.user_id_1
              );
              if (!otherUser) return null;

              return (
                <Card key={connection.user_id_1} className="p-4">
                  <div className="flex items-center gap-4">
                    <UserAvatar name={otherUser.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{otherUser.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {otherUser.email}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(otherUser.id)}
                        disabled={acceptConnection.isPending}
                      >
                        <Check className="size-4" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(otherUser.id)}
                        disabled={deleteConnection.isPending}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          <Separator />
        </div>
      )}

      {/* Connected Friends */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Connected</h3>
          <Badge variant="secondary">{acceptedConnections.length}</Badge>
        </div>

        {acceptedConnections.length === 0 ? (
          <Card className="p-8">
            <div className="text-center space-y-4">
              <div className="size-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <UsersIcon className="size-8 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">No Friends Yet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Add friends to see their goals and celebrate achievements
                  together
                </p>
                <Button onClick={() => setAddFriendOpen(true)}>
                  <UserPlus className="size-4" />
                  Add Your First Friend
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acceptedConnections.map((connection) => {
              const otherUserId =
                connection.user_id_1 === userId
                  ? connection.user_id_2
                  : connection.user_id_1;
              const otherUser = users.find((u) => u.id === otherUserId);

              if (!otherUser) return null;

              // Count their shared goals
              const sharedGoals = goals.filter(
                (g) => g.user_id === otherUserId && g.visibility === 1
              );

              return (
                <Card key={otherUserId} className="p-5">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <UserAvatar
                        name={otherUser.name}
                        size="lg"
                        className="size-14 text-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-lg">
                          {otherUser.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {otherUser.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Target className="size-4 text-muted-foreground" />
                        <span className="font-medium">
                          {sharedGoals.length}
                        </span>
                        <span className="text-muted-foreground">
                          active {sharedGoals.length === 1 ? "goal" : "goals"}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(otherUserId, otherUser.name)}
                      className="w-full"
                    >
                      Remove Friend
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Sent Requests (Optional) */}
      {pendingSent.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-muted-foreground">
                Pending (Sent)
              </h3>
              <Badge variant="outline">{pendingSent.length}</Badge>
            </div>
            <div className="space-y-2">
              {pendingSent.map((connection) => {
                const otherUser = users.find(
                  (u) => u.id === connection.user_id_2
                );
                if (!otherUser) return null;

                return (
                  <Card key={connection.user_id_2} className="p-4 opacity-60">
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium shrink-0">
                        {otherUser.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{otherUser.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {otherUser.email}
                        </div>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}

      <AddFriendDialog
        userId={userId}
        open={addFriendOpen}
        onOpenChange={setAddFriendOpen}
      />

      <ConfirmDialog
        open={confirmRemove.open}
        onOpenChange={(open) =>
          setConfirmRemove({ open, userId: "", userName: "" })
        }
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
