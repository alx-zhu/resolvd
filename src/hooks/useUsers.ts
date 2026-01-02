import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as usersApi from "@/api/users.api";
import { useState, useEffect } from "react";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
  current: () => [...userKeys.all, "current"] as const,
};

/**
 * Fetch all users
 */
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: usersApi.fetchUsers,
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * Fetch user by ID
 */
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => usersApi.fetchUserById(userId),
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * Fetch current user
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: usersApi.fetchCurrentUser,
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * Hook to manage current user switching
 */
export const useCurrentUserId = () => {
  const [userId, setUserId] = useState(usersApi.getCurrentUserId());
  const queryClient = useQueryClient();

  const switchUser = (newUserId: string) => {
    usersApi.setCurrentUserId(newUserId);
    setUserId(newUserId);
    // Invalidate all queries to refetch with new user context
    queryClient.invalidateQueries();
  };

  return { userId, switchUser };
};

/**
 * Fetch user by email
 */
export const useUserByEmail = (email: string) => {
  return useQuery({
    queryKey: [...userKeys.all, "byEmail", email],
    queryFn: () => usersApi.fetchUserByEmail(email),
    enabled: !!email,
    staleTime: 1000 * 60 * 10,
  });
};
