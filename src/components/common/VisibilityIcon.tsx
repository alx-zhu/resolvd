import { Lock, Users } from "lucide-react";

type VisibilityType = 0 | 1 | "private" | "public";

interface VisibilityIconProps {
  /** Visibility level: 0/'private' = private, 1/'public' = public/friends */
  visibility: VisibilityType;
  /** Optional className for custom styling. Defaults to "size-3.5 text-muted-foreground" */
  className?: string;
}

/**
 * Displays an icon representing content visibility.
 * Shows a Lock icon for private content, Users icon for public/friends content.
 */
export function VisibilityIcon({
  visibility,
  className = "size-3.5 text-muted-foreground",
}: VisibilityIconProps) {
  const isPrivate = visibility === 0 || visibility === "private";

  return isPrivate ? (
    <Lock className={className} />
  ) : (
    <Users className={className} />
  );
}
