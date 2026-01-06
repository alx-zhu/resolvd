import type { Log } from "@/types/goals";

export interface Milestone {
  type: "first_log" | "percentage" | "log_count";
  value?: number; // For percentage (25, 50, 75, 100) or log count (10, 20, etc)
  achieved_at: string;
}

/**
 * Detect if a log represents a milestone achievement
 */
export const detectMilestone = (
  logs: Log[],
  newLog: Log,
  targetValue: number
): Milestone | null => {
  // Sort logs by date to get chronological order
  const sortedLogs = [...logs, newLog].sort(
    (a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime()
  );

  const logIndex = sortedLogs.findIndex((l) => l.id === newLog.id);
  const logCount = logIndex + 1;

  // First log milestone
  if (logCount === 1) {
    return {
      type: "first_log",
      achieved_at: newLog.logged_at,
    };
  }

  // Log count milestones (10th, 20th, 30th, etc.)
  if (logCount % 10 === 0) {
    return {
      type: "log_count",
      value: logCount,
      achieved_at: newLog.logged_at,
    };
  }

  // Calculate percentage milestones
  const totalProgress = sortedLogs
    .slice(0, logIndex + 1)
    .reduce((sum, log) => sum + log.value, 0);

  const percentage = (totalProgress / targetValue) * 100;

  // Check if this log crosses a 25% threshold
  const milestones = [25, 50, 75, 100];
  for (const milestone of milestones) {
    const previousProgress = sortedLogs
      .slice(0, logIndex)
      .reduce((sum, log) => sum + log.value, 0);
    const previousPercentage = (previousProgress / targetValue) * 100;

    if (previousPercentage < milestone && percentage >= milestone) {
      return {
        type: "percentage",
        value: milestone,
        achieved_at: newLog.logged_at,
      };
    }
  }

  return null;
};

/**
 * Format milestone for display
 */
export const formatMilestone = (milestone: Milestone): string => {
  switch (milestone.type) {
    case "first_log":
      return "🎯 First progress logged!";
    case "log_count":
      return `🔥 ${milestone.value} logs completed!`;
    case "percentage":
      return `🎉 ${milestone.value}% complete!`;
    default:
      return "";
  }
};
