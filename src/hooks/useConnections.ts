import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as connectionsApi from "@/api/connections.api";

export const connectionKeys = {
  all: ["connections"] as const,
  lists: () => [...connectionKeys.all, "list"] as const,
  byUser: (userId: string) =>
    [...connectionKeys.all, "byUser", userId] as const,
  friends: (userId: string) =>
    [...connectionKeys.all, "friends", userId] as const,
};

/**
 * Fetch all connections
 */
export const useConnections = () => {
  return useQuery({
    queryKey: connectionKeys.lists(),
    queryFn: connectionsApi.fetchConnections,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Fetch connections for a user
 */
export const useUserConnections = (userId: string) => {
  return useQuery({
    queryKey: connectionKeys.byUser(userId),
    queryFn: () => connectionsApi.fetchUserConnections(userId),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Fetch friend IDs for a user
 */
export const useFriendIds = (userId: string) => {
  return useQuery({
    queryKey: connectionKeys.friends(userId),
    queryFn: () => connectionsApi.getFriendIds(userId),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Create a connection request
 */
export const useCreateConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId1,
      userId2,
    }: {
      userId1: string;
      userId2: string;
    }) => connectionsApi.createConnection(userId1, userId2),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.all });
    },
  });
};

/**
 * Accept a connection request
 */
export const useAcceptConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId1,
      userId2,
    }: {
      userId1: string;
      userId2: string;
    }) => connectionsApi.acceptConnection(userId1, userId2),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.all });
    },
  });
};

/**
 * Delete a connection
 */
export const useDeleteConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId1,
      userId2,
    }: {
      userId1: string;
      userId2: string;
    }) => connectionsApi.deleteConnection(userId1, userId2),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: connectionKeys.all });
    },
  });
};
