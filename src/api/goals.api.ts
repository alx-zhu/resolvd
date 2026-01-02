import type { Goal } from "@/types/goals";
import { simulateApiCall } from "./client";
import { mockGoals } from "@/data/mockData";

const GOALS_STORAGE_KEY = "goals-app:goals";

const initializeStorage = (): void => {
  if (!localStorage.getItem(GOALS_STORAGE_KEY)) {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(mockGoals));
  }
};

const getGoalsFromStorage = (): Goal[] => {
  initializeStorage();
  const stored = localStorage.getItem(GOALS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveGoalsToStorage = (goals: Goal[]): void => {
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
};

/**
 * Fetch all goals
 */
export const fetchGoals = async (): Promise<Goal[]> => {
  const goals = getGoalsFromStorage();
  return simulateApiCall(goals);
};

/**
 * Fetch goals by user ID
 */
export const fetchGoalsByUser = async (userId: string): Promise<Goal[]> => {
  const goals = getGoalsFromStorage();
  const userGoals = goals.filter((g) => g.user_id === userId);
  return simulateApiCall(userGoals);
};

/**
 * Create a new goal
 */
export const createGoal = async (
  newGoal: Omit<Goal, "id" | "current_progress" | "created_at" | "updated_at">
): Promise<Goal> => {
  const goals = getGoalsFromStorage();

  const id = `goal-${Date.now()}`;
  const now = new Date().toISOString();

  const goal: Goal = {
    ...newGoal,
    id,
    current_progress: 0,
    created_at: now,
    updated_at: now,
  };

  const updatedGoals = [...goals, goal];
  saveGoalsToStorage(updatedGoals);

  return simulateApiCall(goal);
};

/**
 * Update a goal
 */
export const updateGoal = async (
  goalId: string,
  updates: Partial<Omit<Goal, "id" | "user_id" | "created_at">>
): Promise<Goal> => {
  const goals = getGoalsFromStorage();

  const updatedGoals = goals.map((goal) =>
    goal.id === goalId
      ? { ...goal, ...updates, updated_at: new Date().toISOString() }
      : goal
  );

  saveGoalsToStorage(updatedGoals);

  const updatedGoal = updatedGoals.find((g) => g.id === goalId);
  if (!updatedGoal) throw new Error(`Goal ${goalId} not found`);

  return simulateApiCall(updatedGoal);
};

/**
 * Delete a goal
 */
export const deleteGoal = async (goalId: string): Promise<void> => {
  const goals = getGoalsFromStorage();
  const updatedGoals = goals.filter((g) => g.id !== goalId);
  saveGoalsToStorage(updatedGoals);

  return simulateApiCall(undefined);
};

/**
 * Update goal progress (called after log creation/update/delete)
 */
export const updateGoalProgress = async (
  goalId: string,
  progress: number
): Promise<void> => {
  await updateGoal(goalId, { current_progress: progress });
};
