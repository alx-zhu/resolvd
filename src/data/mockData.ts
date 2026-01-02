import type { User, Goal, Log, Connection } from "@/types/goals";

// Mock users
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "alex@example.com",
    name: "Alex Rodriguez",
    created_at: new Date("2025-01-01").toISOString(),
  },
  {
    id: "user-2",
    email: "sarah@example.com",
    name: "Sarah Johnson",
    created_at: new Date("2025-01-01").toISOString(),
  },
  {
    id: "user-3",
    email: "mike@example.com",
    name: "Mike Chen",
    created_at: new Date("2025-01-01").toISOString(),
  },
  {
    id: "user-4",
    email: "emma@example.com",
    name: "Emma Davis",
    created_at: new Date("2025-01-01").toISOString(),
  },
];

// Mock goals
export const mockGoals: Goal[] = [
  {
    id: "goal-1",
    user_id: "user-1",
    title: "Run a marathon",
    target_value: 42,
    current_progress: 28,
    unit_label: "km",
    deadline: new Date("2026-06-29").toISOString(),
    visibility: 1,
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
    visibility: 1,
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
    visibility: 0,
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
    visibility: 1,
    created_at: new Date("2025-03-01").toISOString(),
    updated_at: new Date("2025-12-15").toISOString(),
  },
  // Sarah's goals
  {
    id: "goal-5",
    user_id: "user-2",
    title: "Run 500km this year",
    target_value: 500,
    current_progress: 250,
    unit_label: "km",
    deadline: new Date("2026-12-31").toISOString(),
    visibility: 1,
    created_at: new Date("2025-01-01").toISOString(),
    updated_at: new Date("2025-12-31").toISOString(),
  },
  // Mike's goals
  {
    id: "goal-6",
    user_id: "user-3",
    title: "Learn to play guitar",
    target_value: 50,
    current_progress: 15,
    unit_label: "hours",
    deadline: new Date("2026-06-30").toISOString(),
    visibility: 1,
    created_at: new Date("2025-08-01").toISOString(),
    updated_at: new Date("2025-12-30").toISOString(),
  },
  // Emma's goals
  {
    id: "goal-7",
    user_id: "user-4",
    title: "Complete 50 yoga sessions",
    target_value: 50,
    current_progress: 12,
    unit_label: "sessions",
    deadline: new Date("2026-12-31").toISOString(),
    visibility: 1,
    created_at: new Date("2025-10-01").toISOString(),
    updated_at: new Date("2025-12-29").toISOString(),
  },
];

// Mock logs
export const mockLogs: Log[] = [
  // Alex's logs
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
  // Sarah's logs
  {
    id: "log-8",
    goal_id: "goal-5",
    value: 10,
    note: "Beach run",
    logged_at: new Date("2025-12-31").toISOString(),
    updated_at: new Date("2025-12-31").toISOString(),
  },
  // Mike's logs
  {
    id: "log-9",
    goal_id: "goal-6",
    value: 2,
    note: "Practice session: worked on chord transitions",
    logged_at: new Date("2025-12-30").toISOString(),
    updated_at: new Date("2025-12-30").toISOString(),
  },
  // Emma's logs
  {
    id: "log-10",
    goal_id: "goal-7",
    value: 1,
    logged_at: new Date("2025-12-29").toISOString(),
    updated_at: new Date("2025-12-29").toISOString(),
  },
];

// Mock connections
export const mockConnections: Connection[] = [
  // Alex <-> Sarah (accepted)
  {
    user_id_1: "user-1",
    user_id_2: "user-2",
    status: "accepted",
    created_at: new Date("2025-01-15").toISOString(),
  },
  // Alex <-> Mike (accepted)
  {
    user_id_1: "user-1",
    user_id_2: "user-3",
    status: "accepted",
    created_at: new Date("2025-02-01").toISOString(),
  },
  // Alex <-> Emma (accepted)
  {
    user_id_1: "user-1",
    user_id_2: "user-4",
    status: "accepted",
    created_at: new Date("2025-03-10").toISOString(),
  },
  // Sarah <-> Mike (accepted)
  {
    user_id_1: "user-2",
    user_id_2: "user-3",
    status: "accepted",
    created_at: new Date("2025-01-20").toISOString(),
  },
];
