import { CheckCircle2, Flame, ListChecks, Target } from "lucide-react";
import type { DayEntry } from "@/types/day";
import type { DailyDataMap } from "@/types/day";
import { calculateStreaks } from "@/lib/calculations";

type DailyStatsProps = {
  day: DayEntry;
  data: DailyDataMap;
};

export function DailyStats({ day, data }: DailyStatsProps) {
  const completedTasks = day.tasks.filter((task) => task.completed).length;
  const streaks = calculateStreaks(data);
  const stats = [
    {
      label: "Tasks",
      value: `${completedTasks}/${day.tasks.length}`,
      icon: <ListChecks className="h-4 w-4" />,
    },
    {
      label: "Completion",
      value: `${day.completion}%`,
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    {
      label: "Streak",
      value: streaks.currentStreak,
      icon: <Flame className="h-4 w-4" />,
    },
    {
      label: "Signal",
      value: day.contribution,
      icon: <Target className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 transition duration-200 hover:bg-white/[0.07]"
          key={stat.label}
        >
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/[0.08] text-stone-200">
            {stat.icon}
          </div>
          <p className="text-2xl font-semibold text-stone-50">{stat.value}</p>
          <p className="mt-1 text-sm text-stone-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
