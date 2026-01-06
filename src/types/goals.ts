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

export type ViewMode = "grid" | "list";
