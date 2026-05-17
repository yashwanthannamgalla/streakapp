"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DailyStats } from "./DailyStats";
import { ProgressRing } from "./ProgressRing";
import { TaskCard } from "./TaskCard";
import { TaskInput } from "./TaskInput";
import { useDailyData } from "@/hooks/useDailyData";
import { formatLongDate, isDateKey } from "@/lib/date";
import { getCompletionLabel } from "@/utils/emoji";
import { moodOptions } from "@/utils/emoji";
import { cn } from "@/lib/cn";

type DailyDashboardProps = {
  date: string;
};

export function DailyDashboard({ date }: DailyDashboardProps) {
  const dateKey = isDateKey(date) ? date : new Date().toISOString().slice(0, 10);
  const {
    data,
    day,
    addTask,
    deleteTask,
    toggleTask,
    updateMood,
    updateReflection,
  } = useDailyData(dateKey);

  const statusLabel = getCompletionLabel(day.completion, day.tasks.length);
  const groupedTasks = day.tasks.reduce((groups, task) => {
  const category = task.category || "deep-work";

  if (!groups[category]) {
    groups[category] = [];
  }

  groups[category].push(task);

  return groups;
}, {} as Record<string, typeof day.tasks>);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-black/20 p-5 shadow-[0_22px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              aria-label="Back to calendar"
              icon={<ArrowLeft className="h-4 w-4" />}
              size="icon"
              type="button"
              variant="ghost"
            />
          </Link>
          <div>
            <p className="flex items-center gap-2 text-sm text-stone-400">
              <CalendarDays className="h-4 w-4" />
              {formatLongDate(dateKey)}
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-stone-50 sm:text-4xl">
              {day.emoji} {statusLabel}
            </h1>
          </div>
        </div>
        <Link href="/analytics">
          <Button type="button" variant="secondary">
            View analytics
          </Button>
        </Link>
      </header>

      <DailyStats data={data} day={day} />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-stone-400">Today&apos;s commitments</p>
              <h2 className="mt-1 text-2xl font-semibold text-stone-50">
                Actions that prove the identity
              </h2>
            </div>
          </div>

          <TaskInput onAddTask={addTask} />

          <div className="flex flex-col gap-3">
            {day.tasks.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-white/10 bg-black/15 p-8 text-center">
                <p className="text-lg font-medium text-stone-200">A quiet page.</p>
                <p className="mt-2 text-sm text-stone-500">
                  Choose one action worth becoming consistent at.
                </p>
              </div>
            ) : (
              day.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  onDelete={deleteTask}
                  onToggle={toggleTask}
                  task={task}
                />
              ))
            )}
          </div>
        </Card>

        <aside className="flex flex-col gap-6">
          <Card className="grid place-items-center">
            <ProgressRing label={statusLabel} value={day.completion} />
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/[0.08]">
                <NotebookPen className="h-5 w-5 text-stone-200" />
              </div>
              <div>
                <p className="text-sm text-stone-400">Mood</p>
                <p className="font-medium text-stone-100">Emotional weather</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {moodOptions.map((mood) => (
                <button
                  className={cn(
                    "min-h-12 rounded-2xl border px-3 text-left text-sm transition duration-200",
                    day.mood === mood.key
                      ? mood.tone
                      : "border-white/10 bg-white/[0.035] text-stone-400 hover:bg-white/[0.07] hover:text-stone-100",
                  )}
                  key={mood.key}
                  onClick={() => updateMood(mood.key)}
                  type="button"
                >
                  <span className="mr-2">{mood.emoji}</span>
                  {mood.label}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <label className="text-sm text-stone-400" htmlFor="reflection">
              Reflection
            </label>
            <textarea
              className="mt-3 min-h-40 w-full resize-none rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-stone-100 outline-none transition duration-200 placeholder:text-stone-600 focus:border-lime-200/40 focus:bg-black/30"
              id="reflection"
              onChange={(event) => updateReflection(event.target.value)}
              placeholder="What did today reveal?"
              value={day.reflection}
            />
          </Card>
        </aside>
      </section>
    </main>
  );
}
