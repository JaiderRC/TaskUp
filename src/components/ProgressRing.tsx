import { cn } from "./ui/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent";
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

export function ProgressRing({ 
  progress, 
  size = "md", 
  color = "primary", 
  showPercentage = true, 
  label,
  className 
}: ProgressRingProps) {
  const sizes = {
    sm: { width: 60, stroke: 4, fontSize: "text-xs" },
    md: { width: 100, stroke: 6, fontSize: "text-sm" },
    lg: { width: 140, stroke: 8, fontSize: "text-base" }
  };

  const colors = {
    primary: "stroke-primary",
    secondary: "stroke-secondary", 
    accent: "stroke-accent"
  };

  const { width, stroke, fontSize } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative">
        <svg
          width={width}
          height={width}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-300 ease-in-out", colors[color])}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage && (
            <span className={cn("font-semibold text-foreground", fontSize)}>
              {Math.round(progress)}%
            </span>
          )}
        </div>
      </div>
      
      {label && (
        <span className="text-sm text-muted-foreground text-center">
          {label}
        </span>
      )}
    </div>
  );
}