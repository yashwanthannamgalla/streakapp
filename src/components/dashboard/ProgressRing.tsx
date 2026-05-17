import { cn } from "@/lib/cn";

type ProgressRingProps = {
  value: number;
  label: string;
  className?: string;
};

export function ProgressRing({ value, label, className }: ProgressRingProps) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative grid place-items-center", className)}>
      <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
        <circle
          className="text-white/10"
          cx="60"
          cy="60"
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
        />
        <circle
          className="text-lime-200 transition-all duration-500"
          cx="60"
          cy="60"
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="10"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-semibold text-stone-50">{value}%</p>
        <p className="mt-1 text-xs text-stone-400">{label}</p>
      </div>
    </div>
  );
}
