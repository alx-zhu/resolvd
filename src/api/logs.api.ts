import type { Log } from "@/types/goals";
import { simulateApiCall } from "./client";
import { mockLogs } from "@/data/mockData";

const LOGS_STORAGE_KEY = "goals-app:logs";

const initializeStorage = (): void => {
  if (!localStorage.getItem(LOGS_STORAGE_KEY)) {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(mockLogs));
  }
};

const getLogsFromStorage = (): Log[] => {
  initializeStorage();
  const stored = localStorage.getItem(LOGS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLogsToStorage = (logs: Log[]): void => {
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
};

/**
 * Fetch all logs
 */
export const fetchLogs = async (): Promise<Log[]> => {
  const logs = getLogsFromStorage();
  return simulateApiCall(logs);
};

/**
 * Fetch logs by goal ID
 */
export const fetchLogsByGoal = async (goalId: string): Promise<Log[]> => {
  const logs = getLogsFromStorage();
  const goalLogs = logs.filter((l) => l.goal_id === goalId);
  return simulateApiCall(goalLogs);
};

/**
 * Create a new log
 */
export const createLog = async (
  newLog: Omit<Log, "id" | "updated_at">
): Promise<Log> => {
  const logs = getLogsFromStorage();

  const id = `log-${Date.now()}`;
  const now = new Date().toISOString();

  const log: Log = {
    ...newLog,
    id,
    updated_at: now,
  };

  const updatedLogs = [...logs, log];
  saveLogsToStorage(updatedLogs);

  return simulateApiCall(log);
};

/**
 * Update a log
 */
export const updateLog = async (
  logId: string,
  updates: Partial<Omit<Log, "id" | "goal_id">>
): Promise<Log> => {
  const logs = getLogsFromStorage();

  const updatedLogs = logs.map((log) =>
    log.id === logId
      ? { ...log, ...updates, updated_at: new Date().toISOString() }
      : log
  );

  saveLogsToStorage(updatedLogs);

  const updatedLog = updatedLogs.find((l) => l.id === logId);
  if (!updatedLog) throw new Error(`Log ${logId} not found`);

  return simulateApiCall(updatedLog);
};

/**
 * Delete a log
 */
export const deleteLog = async (logId: string): Promise<void> => {
  const logs = getLogsFromStorage();
  const updatedLogs = logs.filter((l) => l.id !== logId);
  saveLogsToStorage(updatedLogs);

  return simulateApiCall(undefined);
};

/**
 * Calculate total progress for a goal
 */
export const calculateGoalProgress = async (goalId: string): Promise<number> => {
  const logs = await fetchLogsByGoal(goalId);
  const total = logs.reduce((sum, log) => sum + log.value, 0);
  return total;
};
