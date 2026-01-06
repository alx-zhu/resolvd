import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  count?: number;
  variant?: "default" | "secondary" | "outline";
  children?: ReactNode;
}

export function SectionHeader({
  title,
  count,
  variant = "secondary",
  children,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-semibold">{title}</h3>
      <div className="flex items-center gap-2">
        {count !== undefined && <Badge variant={variant}>{count}</Badge>}
        {children}
      </div>
    </div>
  );
}
