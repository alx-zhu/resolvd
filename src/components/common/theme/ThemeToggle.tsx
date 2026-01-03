import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/providers/useTheme";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Theme = "light" | "dark" | "system";

const themeConfig = {
  light: { icon: Sun, label: "Light" },
  dark: { icon: Moon, label: "Dark" },
  system: { icon: Monitor, label: "System" },
} as const;

function SimpleThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const ActiveIcon = themeConfig[theme].icon;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="gap-2"
      title={`Theme: ${themeConfig[theme].label}`}
    >
      <ActiveIcon className="h-5 w-5" />
      <span className="text-sm">{themeConfig[theme].label}</span>
    </Button>
  );
}

function PillboxThemeToggle({
  direction = "left",
}: {
  direction?: "left" | "right";
}) {
  const { theme, setTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const BUTTON_SIZE = 32; // px
  const GAP = 4; // px
  const PADDING = 4; // px (p-1)

  const allThemes: Theme[] = ["light", "dark", "system"];
  const otherThemes = allThemes.filter((t) => t !== theme);

  const handleThemeSelect = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    setIsExpanded(false);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const ActiveIcon = themeConfig[theme].icon;

  // Calculate positions based on direction
  const getButtonPosition = (index: number) => {
    if (direction === "left") {
      // Expand to the left: buttons appear left of the active button
      return {
        right: PADDING + (otherThemes.length - index) * (BUTTON_SIZE + GAP),
      };
    } else {
      // Expand to the right: buttons appear right of the active button
      return {
        left: PADDING + (index + 1) * (BUTTON_SIZE + GAP),
      };
    }
  };

  const activeButtonPosition =
    direction === "left" ? { right: PADDING } : { left: PADDING };

  const containerWidth = isExpanded
    ? BUTTON_SIZE * 3 + GAP * 2 + PADDING * 2
    : BUTTON_SIZE + PADDING * 2;

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        className="relative rounded-full border bg-background"
        initial={false}
        animate={{ width: containerWidth }}
        transition={{
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{ height: BUTTON_SIZE + PADDING * 2 }}
      >
        {/* Selected option - always visible, positioned based on direction */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-1 rounded-full p-2 bg-primary text-primary-foreground transition-colors"
          style={{
            ...activeButtonPosition,
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
          }}
          title={themeConfig[theme].label}
        >
          <ActiveIcon className="h-4 w-4" />
        </button>

        {/* Non-selected options - slide in from direction */}
        <AnimatePresence initial={false}>
          {isExpanded &&
            otherThemes.map((t, index) => {
              const Icon = themeConfig[t].icon;
              const position = getButtonPosition(index);

              return (
                <motion.button
                  key={t}
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                    ...(direction === "left"
                      ? { right: activeButtonPosition.right }
                      : { left: activeButtonPosition.left }),
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    ...position,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    ...(direction === "left"
                      ? { right: activeButtonPosition.right }
                      : { left: activeButtonPosition.left }),
                  }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  onClick={() => handleThemeSelect(t)}
                  className="absolute top-1 rounded-full p-2 hover:bg-muted transition-colors"
                  style={{
                    width: BUTTON_SIZE,
                    height: BUTTON_SIZE,
                  }}
                  title={themeConfig[t].label}
                >
                  <Icon className="h-4 w-4" />
                </motion.button>
              );
            })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function ThemeToggle({
  direction = "left",
}: { direction?: "left" | "right" } = {}) {
  return (
    <>
      <div className="sm:hidden">
        <SimpleThemeToggle />
      </div>
      <div className="hidden sm:block">
        <PillboxThemeToggle direction={direction} />
      </div>
    </>
  );
}
