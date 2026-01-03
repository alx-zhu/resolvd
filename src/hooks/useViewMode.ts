import { useState, useCallback } from "react";
import type { ViewMode } from "@/types/goals";

const VIEW_MODE_STORAGE_KEY = "goals-view-mode";

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    return (saved as ViewMode) || "grid";
  });

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => {
      const newMode: ViewMode = prev === "grid" ? "list" : "grid";
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, newMode);
      return newMode;
    });
  }, []);

  return { viewMode, toggleViewMode };
}
