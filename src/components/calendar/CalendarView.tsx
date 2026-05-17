"use client";

import Calendar from "react-calendar";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Flame,
  Settings,
  Sparkles,
  Trophy,
} from "lucide-react";
import { CalendarTile } from "./CalendarTile";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  calculateMonthAverage,
  calculateStreaks,
  hasTrackedData,
} from "@/lib/calculations";
import {
  formatDateKey,
  getMonthLabel,
  getTodayKey,
  isSameDate,
  isSameMonth,
} from "@/lib/date";
import { cn } from "@/lib/cn";
import { useDailyData } from "@/hooks/useDailyData";
import { getCompletionLabel } from "@/utils/emoji";

export function CalendarView() {
  const router = useRouter();
  const todayKey = getTodayKey();
  const [activeDate, setActiveDate] = useState(new Date());
  const { data, isReady } = useDailyData(todayKey);

  const streaks = useMemo(() => calculateStreaks(data), [data]);
  const monthAverage = useMemo(
    () => calculateMonthAverage(data, activeDate),
    [activeDate, data],
  );

  const trackedDays = useMemo(
    () =>
      Object.values(data).filter((entry) => {
        const date = new Date(`${entry.date}T00:00:00`);
        return isSameMonth(date, activeDate) && hasTrackedData(entry);
      }).length,
    [activeDate, data],
  );

  const todayEntry = data[todayKey];
  const todayStatusLabel = todayEntry
    ? getCompletionLabel(todayEntry.completion, todayEntry.tasks.length)
    : "Open loop";

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-black/20 p-5 shadow-[0_22px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-3xl border border-white/10 bg-white text-neutral-950 shadow-[0_18px_70px_rgba(255,255,255,0.12)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-stone-400">StreakApp</p>
            <h1 className="text-2xl font-semibold text-stone-50 sm:text-3xl">
              {getMonthLabel(activeDate)}
            </h1>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <Link href="/analytics">
            <Button icon={<BarChart3 className="h-4 w-4" />} type="button" variant="ghost">
              Analytics
            </Button>
          </Link>
          <Link href="/settings">
            <Button icon={<Settings className="h-4 w-4" />} type="button" variant="ghost">
              Settings
            </Button>
          </Link>
          <Link href={`/day/${todayKey}`}>
            <Button icon={<ArrowRight className="h-4 w-4" />} type="button" variant="primary">
              Today
            </Button>
          </Link>
        </nav>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-stone-400">Monthly rhythm</p>
              <h2 className="mt-1 text-3xl font-semibold text-stone-50 sm:text-4xl">
                Consistency calendar
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2">
                <p className="text-lg font-semibold text-stone-50">{trackedDays}</p>
                <p className="text-xs text-stone-500">Days</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2">
                <p className="text-lg font-semibold text-stone-50">{monthAverage}%</p>
                <p className="text-xs text-stone-500">Avg</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2">
                <p className="text-lg font-semibold text-stone-50">{streaks.currentStreak}</p>
                <p className="text-xs text-stone-500">Streak</p>
              </div>
            </div>
          </div>

          <Calendar
            calendarType="gregory"
            className="streak-calendar"
            locale="en-US"
            next2Label={null}
            nextLabel={<ChevronRight className="mx-auto h-5 w-5" />}
            onActiveStartDateChange={({ activeStartDate }) => {
              if (activeStartDate) {
                setActiveDate(activeStartDate);
              }
            }}
            onClickDay={(date) => router.push(`/day/${formatDateKey(date)}`)}
            prev2Label={null}
            prevLabel={<ChevronLeft className="mx-auto h-5 w-5" />}
            tileClassName={({ date, view }) => {
              if (view !== "month") {
                return undefined;
              }

              const key = formatDateKey(date);
              const entry = data[key];

              return cn(
                "streak-calendar-tile",
                isSameDate(date, new Date()) && "is-today",
                !isSameMonth(date, activeDate) && "is-muted",
                hasTrackedData(entry) && `contribution-${entry?.contribution ?? 0}`,
              );
            }}
            tileContent={({ date, view }) =>
              view === "month" ? <CalendarTile entry={data[formatDateKey(date)]} /> : null
            }
            value={activeDate}
          />
        </Card>

        <aside className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-stone-400">Identity signal</p>
                <h2 className="mt-1 text-2xl font-semibold text-stone-50">
                  Quiet proof, day by day.
                </h2>
              </div>
              <Flame className="h-6 w-6 text-amber-200" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-3xl border border-amber-200/15 bg-amber-200/10 p-4">
                <p className="text-3xl font-semibold text-amber-100">
                  {streaks.currentStreak}
                </p>
                <p className="mt-1 text-sm text-amber-100/70">Current streak</p>
              </div>
              <div className="rounded-3xl border border-emerald-200/15 bg-emerald-200/10 p-4">
                <p className="text-3xl font-semibold text-emerald-100">
                  {streaks.longestStreak}
                </p>
                <p className="mt-1 text-sm text-emerald-100/70">Longest streak</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-3xl bg-white/[0.08]">
                <CalendarDays className="h-5 w-5 text-stone-200" />
              </div>
              <div>
                <p className="text-sm text-stone-400">Today</p>
                <p className="font-medium text-stone-100">
                  {todayEntry?.completion ?? 0}% complete
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <div>
                <p className="text-sm text-stone-400">Status</p>
                <p className="mt-1 text-lg font-semibold text-stone-50">
                  {todayEntry?.emoji ?? "🌙"} {isReady ? todayStatusLabel : "Loading"}
                </p>
              </div>
              <Link href={`/day/${todayKey}`}>
                <Button aria-label="Open today" icon={<ArrowRight className="h-4 w-4" />} size="icon" />
              </Link>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-3xl bg-white/[0.08]">
                <Trophy className="h-5 w-5 text-stone-200" />
              </div>
              <div>
                <p className="text-sm text-stone-400">Threshold</p>
                <p className="font-medium text-stone-100">75% keeps the chain alive</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  className={cn(
                    "h-9 rounded-2xl border border-white/10",
                    level === 0 && "bg-white/[0.035]",
                    level === 1 && "bg-rose-300/20",
                    level === 2 && "bg-amber-300/25",
                    level === 3 && "bg-emerald-300/35",
                    level === 4 && "bg-lime-200/55",
                  )}
                  key={level}
                />
              ))}
            </div>
          </Card>
        </aside>
      </section>
    </main>
  );
}
