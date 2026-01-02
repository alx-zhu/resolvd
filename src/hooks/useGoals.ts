import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Goal } from "@/types/goals";
import * as goalsApi from "@/api/goals.api";
import * as logsApi from "@/api/logs.api";

export const goalKeys = {
  all: ["goals"] as const,
  lists: () => [...goalKeys.all, "list"] as const,
  list: (userId?: string) =>
    userId ? [...goalKeys.all, "list", userId] : [...goalKeys.all, "list"],
  detail: (id: string) => [...goalKeys.all, "detail", id] as const,
};

/**
 * Fetch all goals
 */
export const useGoals = () => {
  return useQuery({
    queryKey: goalKeys.lists(),
    queryFn: goalsApi.fetchGoals,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Fetch goals by user
 */
export const useGoalsByUser = (userId: string) => {
  return useQuery({
    queryKey: goalKeys.list(userId),
    queryFn: () => goalsApi.fetchGoalsByUser(userId),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Create a new goal
 */
export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalsApi.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};

/**
 * Update a goal
 */
export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      goalId,
      updates,
    }: {
      goalId: string;
      updates: Partial<Omit<Goal, "id" | "user_id" | "created_at">>;
    }) => goalsApi.updateGoal(goalId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};

/**
 * Delete a goal
 */
export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalsApi.deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};

/**
 * Recalculate and update goal progress from logs
 */
export const useRecalculateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalId: string) => {
      const progress = await logsApi.calculateGoalProgress(goalId);
      await goalsApi.updateGoalProgress(goalId, progress);
      return progress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};
