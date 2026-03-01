interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "indigo" | "emerald" | "amber" | "red" | "blue";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const colorStyles = {
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
};

const trackColorStyles = {
  indigo: "bg-indigo-100",
  emerald: "bg-emerald-100",
  amber: "bg-amber-100",
  red: "bg-red-100",
  blue: "bg-blue-100",
};

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export default function ProgressBar({
  value,
  max = 100,
  color = "indigo",
  size = "md",
  showLabel = true,
  label,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {/* Label and percentage */}
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-slate-700">{label}</span>
          )}
          <span className="text-sm font-semibold text-slate-600 ml-auto">
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      {/* Track */}
      <div
        className={`w-full rounded-full overflow-hidden ${trackColorStyles[color]} ${sizeStyles[size]}`}
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `Progression : ${Math.round(percentage)}%`}
      >
        {/* Fill */}
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorStyles[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
