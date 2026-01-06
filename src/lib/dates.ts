import { format, differenceInCalendarDays } from "date-fns";

/**
 * Calculate pacing required to reach goal
 */
export const calculatePacing = (
  target: number,
  current: number,
  deadline: string
) => {
  const remaining = target - current;
  const daysLeft = differenceInCalendarDays(new Date(deadline), new Date());

  if (daysLeft <= 0) {
    return { perDay: 0, perWeek: 0, perMonth: 0, daysLeft };
  }

  const perDay = remaining / daysLeft;
  const perWeek = perDay * 7;
  const perMonth = perDay * 30.44; // Average days per month

  return {
    perDay: Math.round(perDay * 100) / 100,
    perWeek: Math.round(perWeek * 100) / 100,
    perMonth: Math.round(perMonth * 100) / 100,
    daysLeft,
  };
};

/**
 * Format date for display
 */
export const formatDate = (date: string | Date, formatStr = "MMM d, yyyy") => {
  return format(new Date(date), formatStr);
};

/**
 * Calculate relative time (e.g., "2 days ago")
 */
export const getRelativeTime = (date: string | Date): string => {
  const days = differenceInCalendarDays(new Date(), new Date(date));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
};

/**
 * Format deadline display (e.g., "179d left" or "Overdue by 5d")
 */
export const formatDeadline = (deadline: string): string => {
  const daysLeft = differenceInCalendarDays(new Date(deadline), new Date());

  if (daysLeft < 0) {
    return `Overdue by ${Math.abs(daysLeft)}d`;
  }
  if (daysLeft === 0) return "Due today";
  if (daysLeft === 1) return "1 day left";
  return `${daysLeft}d left`;
};
