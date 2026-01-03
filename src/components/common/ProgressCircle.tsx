import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
}

export function ProgressCircle({
  percentage,
  size = 64,
  strokeWidth = 8,
  showText = true,
}: ProgressCircleProps) {
  return (
    <div className="shrink-0" style={{ width: size, height: size }}>
      <CircularProgressbar
        value={percentage}
        text={showText ? `${percentage}%` : ""}
        styles={buildStyles({
          rotation: 0,
          strokeLinecap: "round",
          textSize: "20px",
          pathTransitionDuration: 0.5,
          pathColor: `var(--primary)`,
          textColor: `var(--foreground)`,
          trailColor: `var(--muted)`,
          backgroundColor: "transparent",
        })}
        strokeWidth={strokeWidth}
      />
    </div>
  );
}
