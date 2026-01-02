export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target_value: number;
  current_progress: number; // Denormalized - calculated from logs
  unit_label?: string;
  deadline: string;
  visibility: 0 | 1; // 0: private, 1: friends only
  created_at: string;
  updated_at: string;
}

export interface Log {
  id: string;
  goal_id: string;
  value: number;
  note?: string;
  logged_at: string;
  updated_at: string;
}

export interface Connection {
  user_id_1: string;
  user_id_2: string;
  status: "pending" | "accepted";
  created_at: string;
}

export type ViewMode = "grid" | "list";

export interface Milestone {
  type: "first_log" | "percentage" | "log_count";
  value?: number; // For percentage (25, 50, 75, 100) or log count (10, 20, etc)
  achieved_at: string;
}
