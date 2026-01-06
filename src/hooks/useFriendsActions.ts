import { useState } from "react";
import { useAcceptConnection, useDeleteConnection } from "./useConnections";

interface ConfirmRemoveState {
  open: boolean;
  userId: string;
  userName: string;
}

export function useFriendsActions(userId: string) {
  const [confirmRemove, setConfirmRemove] = useState<ConfirmRemoveState>({
    open: false,
    userId: "",
    userName: "",
  });

  const acceptConnection = useAcceptConnection();
  const deleteConnection = useDeleteConnection();

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

  const handleRemove = (connectionUserId: string, userName: string) => {
    setConfirmRemove({ open: true, userId: connectionUserId, userName });
  };

  const confirmRemoveAction = async () => {
    try {
      await deleteConnection.mutateAsync({
        userId1: userId,
        userId2: confirmRemove.userId,
      });
      setConfirmRemove({ open: false, userId: "", userName: "" });
    } catch (error) {
      console.error("Failed to remove friend:", error);
    }
  };

  const closeConfirmDialog = () => {
    setConfirmRemove({ open: false, userId: "", userName: "" });
  };

  return {
    confirmRemove,
    handleAccept,
    handleReject,
    handleRemove,
    confirmRemoveAction,
    closeConfirmDialog,
    isAccepting: acceptConnection.isPending,
    isRejecting: deleteConnection.isPending,
  };
}
