import type { User, Goal, Log } from "@/types/goals";

// Mock user - single user for MVP
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "alex@example.com",
    name: "Alex Rodriguez",
    created_at: new Date("2025-01-01").toISOString(),
  },
];

// Mock goals for user
export const mockGoals: Goal[] = [
  {
    id: "goal-1",
    user_id: "user-1",
    title: "Run a marathon",
    target_value: 42,
    current_progress: 28,
    unit_label: "km",
    deadline: new Date("2026-06-29").toISOString(),
    created_at: new Date("2025-11-15").toISOString(),
    updated_at: new Date("2025-12-31").toISOString(),
  },
  {
    id: "goal-2",
    user_id: "user-1",
    title: "Read 24 books",
    target_value: 24,
    current_progress: 12,
    unit_label: "books",
    deadline: new Date("2026-12-31").toISOString(),
    created_at: new Date("2025-01-01").toISOString(),
    updated_at: new Date("2025-12-30").toISOString(),
  },
  {
    id: "goal-3",
    user_id: "user-1",
    title: "Learn Spanish",
    target_value: 100,
    current_progress: 45,
    unit_label: "hours",
    deadline: new Date("2026-12-31").toISOString(),
    created_at: new Date("2025-09-10").toISOString(),
    updated_at: new Date("2025-12-28").toISOString(),
  },
  {
    id: "goal-4",
    user_id: "user-1",
    title: "Save for vacation",
    target_value: 5000,
    current_progress: 3200,
    unit_label: "dollars",
    deadline: new Date("2026-06-01").toISOString(),
    created_at: new Date("2025-03-01").toISOString(),
    updated_at: new Date("2025-12-15").toISOString(),
  },
];

// Mock logs
export const mockLogs: Log[] = [
  {
    id: "log-1",
    goal_id: "goal-1",
    value: 5,
    note: "Morning run in the park",
    logged_at: new Date("2025-12-31").toISOString(),
    updated_at: new Date("2025-12-31").toISOString(),
  },
  {
    id: "log-2",
    goal_id: "goal-1",
    value: 10,
    note: "Long weekend run",
    logged_at: new Date("2025-12-27").toISOString(),
    updated_at: new Date("2025-12-27").toISOString(),
  },
  {
    id: "log-3",
    goal_id: "goal-1",
    value: 8,
    logged_at: new Date("2025-12-20").toISOString(),
    updated_at: new Date("2025-12-20").toISOString(),
  },
  {
    id: "log-4",
    goal_id: "goal-1",
    value: 5,
    logged_at: new Date("2025-12-15").toISOString(),
    updated_at: new Date("2025-12-15").toISOString(),
  },
  {
    id: "log-5",
    goal_id: "goal-2",
    value: 1,
    note: "Finished 'Atomic Habits'",
    logged_at: new Date("2025-12-30").toISOString(),
    updated_at: new Date("2025-12-30").toISOString(),
  },
  {
    id: "log-6",
    goal_id: "goal-2",
    value: 2,
    logged_at: new Date("2025-12-15").toISOString(),
    updated_at: new Date("2025-12-15").toISOString(),
  },
  {
    id: "log-7",
    goal_id: "goal-3",
    value: 5,
    logged_at: new Date("2025-12-28").toISOString(),
    updated_at: new Date("2025-12-28").toISOString(),
  },
];
