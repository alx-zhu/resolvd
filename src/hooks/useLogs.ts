import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Log } from "@/types/goals";
import * as logsApi from "@/api/logs.api";
import * as goalsApi from "@/api/goals.api";
import { goalKeys } from "./useGoals";

export const logKeys = {
  all: ["logs"] as const,
  lists: () => [...logKeys.all, "list"] as const,
  byGoal: (goalId: string) => [...logKeys.all, "byGoal", goalId] as const,
};

/**
 * Fetch all logs
 */
export const useLogs = () => {
  return useQuery({
    queryKey: logKeys.lists(),
    queryFn: logsApi.fetchLogs,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Fetch logs by goal
 */
export const useLogsByGoal = (goalId: string) => {
  return useQuery({
    queryKey: logKeys.byGoal(goalId),
    queryFn: () => logsApi.fetchLogsByGoal(goalId),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Create a new log
 */
export const useCreateLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newLog: Omit<Log, "id" | "updated_at">) => {
      const log = await logsApi.createLog(newLog);

      // Recalculate and update goal progress
      const progress = await logsApi.calculateGoalProgress(newLog.goal_id);
      await goalsApi.updateGoalProgress(newLog.goal_id, progress);

      return log;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: logKeys.all });
      queryClient.invalidateQueries({
        queryKey: logKeys.byGoal(variables.goal_id),
      });
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};

/**
 * Update a log
 */
export const useUpdateLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      logId,
      goalId,
      updates,
    }: {
      logId: string;
      goalId: string;
      updates: Partial<Omit<Log, "id" | "goal_id">>;
    }) => {
      const log = await logsApi.updateLog(logId, updates);

      // Recalculate and update goal progress if value changed
      if (updates.value !== undefined) {
        const progress = await logsApi.calculateGoalProgress(goalId);
        await goalsApi.updateGoalProgress(goalId, progress);
      }

      return log;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logKeys.all });
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};

/**
 * Delete a log
 */
export const useDeleteLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      logId,
      goalId,
    }: {
      logId: string;
      goalId: string;
    }) => {
      await logsApi.deleteLog(logId);

      // Recalculate and update goal progress
      const progress = await logsApi.calculateGoalProgress(goalId);
      await goalsApi.updateGoalProgress(goalId, progress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logKeys.all });
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};
