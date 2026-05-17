"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  CalendarDays,
  Flame,
  HeartPulse,
  Leaf,
  LineChart,
  Moon,
  Sparkles,
  Trophy,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useDailyData } from "@/hooks/useDailyData";
import {
  calculateMonthAverage,
  calculateStreaks,
  calculateTotalTasks,
  getHabitInsights,
  getWeeklySeries,
} from "@/lib/calculations";
import { getTodayKey } from "@/lib/date";
import {
  getAnalyticsSummary,
  getBehavioralInsights,
  getBestMood,
  getConsistencyIdentity,
  moodVisuals,
} from "@/lib/analytics";
import { getMoodOption } from "@/utils/emoji";
import { WeeklyChart } from "./WeeklyChart";
import { MoodHeatmap } from "./MoodHeatmap";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function AnalyticsDashboard() {
  const { data } = useDailyData(getTodayKey());
  const streaks = calculateStreaks(data);
  const totals = calculateTotalTasks(data);
  const weekly = getWeeklySeries(data);
  const monthAverage = calculateMonthAverage(data);
  const habits = getHabitInsights(data);
  const summary = getAnalyticsSummary(data);
  const identity = getConsistencyIdentity(data);
  const insights = getBehavioralInsights(data);
  const bestMood = getBestMood(data);
  const bestMoodOption = getMoodOption(bestMood?.mood);
  const bestMoodVisual = moodVisuals[bestMoodOption.key];
  const hasData = summary.trackedDays > 0;

  const stats = [
    {
      label: "Quiet streak",
      value: hasData ? streaks.currentStreak : "Begin",
      detail: hasData ? `${streaks.longestStreak} day best` : "One day is enough",
      icon: <Flame className="h-4 w-4" />,
    },
    {
      label: "Month average",
      value: hasData ? `${monthAverage}%` : "Unwritten",
      detail: hasData ? "Completion signal" : "Waiting for signal",
      icon: <HeartPulse className="h-4 w-4" />,
    },
    {
      label: "This week",
      value: hasData ? `${summary.trackedThisWeek}/7` : "Open",
      detail: "Days with a visible mark",
      icon: <CalendarDays className="h-4 w-4" />,
    },
    {
      label: "Tasks completed",
      value: totals.total > 0 ? `${totals.completed}/${totals.total}` : "None yet",
      detail: totals.total > 0 ? "Promises kept" : "Start with one action",
      icon: <Brain className="h-4 w-4" />,
    },
  ];

  return (
    <motion.main
      animate="show"
      className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-7 px-4 py-6 sm:px-6 lg:px-8"
      initial="hidden"
      variants={containerVariants}
    >
      <motion.header
        className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-black/20 p-5 shadow-[0_22px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl md:flex-row md:items-center md:justify-between"
        variants={itemVariants}
      >
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
              <LineChart className="h-4 w-4" />
              Analytics
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-stone-50 sm:text-5xl">
              Behavioral signal
            </h1>
          </div>
        </div>
        <p className="max-w-md text-sm leading-6 text-stone-400">
          A softer mirror for consistency, mood, recovery, and the identity you are quietly building.
        </p>
      </motion.header>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div variants={itemVariants}>
          <Card className={`relative min-h-full overflow-hidden p-6 sm:p-8 bg-gradient-to-br ${identity.accent}`}>
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/[0.08] blur-3xl" />
            <div className="relative flex min-h-[260px] flex-col justify-between gap-10">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.08] text-stone-100">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="text-sm text-stone-400">Consistency identity</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-normal text-stone-50 sm:text-6xl">
                  {identity.name}
                </h2>
                <p className="mt-4 max-w-xl text-lg leading-8 text-stone-300">
                  {identity.subtitle}
                </p>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-stone-400">{identity.body}</p>
            </div>
          </Card>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -3, transition: { duration: 0.25 } }}
            >
              <Card className="h-full p-5">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.08] text-stone-200">
                  {stat.icon}
                </div>
                <p className="break-words text-3xl font-semibold text-stone-50 sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-3 text-sm font-medium text-stone-300">{stat.label}</p>
                <p className="mt-1 text-sm leading-6 text-stone-500">{stat.detail}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <motion.div variants={itemVariants}>
          <Card className="p-5 sm:p-6">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-stone-400">Weekly consistency</p>
                <h2 className="mt-1 text-2xl font-semibold text-stone-50 sm:text-3xl">
                  Quiet momentum
                </h2>
              </div>
              <p className="text-sm text-stone-500">
                {hasData ? `${summary.average}% lifetime average` : "One mark starts the rhythm"}
              </p>
            </div>
            <WeeklyChart data={weekly} />
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-5 sm:p-6">
            <div className="mb-6">
              <p className="text-sm text-stone-400">Emotional pattern</p>
              <h2 className="mt-1 text-2xl font-semibold text-stone-50 sm:text-3xl">
                Mood heatmap
              </h2>
            </div>
            <MoodHeatmap data={data} />
          </Card>
        </motion.div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {insights.map((insight) => (
          <motion.div
            key={`${insight.eyebrow}-${insight.title}`}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
          >
            <Card className="h-full p-5">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.07] text-stone-200">
                <Waves className="h-4 w-4" />
              </div>
              <p className="text-sm text-stone-500">{insight.eyebrow}</p>
              <h3 className="mt-2 text-xl font-semibold leading-7 text-stone-50">
                {insight.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-stone-400">{insight.body}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="h-full p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.08] text-stone-200">
                <Trophy className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-stone-400">Habit signals</p>
                <h2 className="text-2xl font-semibold text-stone-50">Best kept patterns</h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-emerald-200/15 bg-emerald-200/[0.08] p-5">
                <p className="text-sm text-emerald-100/70">Most reliable</p>
                <p className="mt-3 text-2xl font-semibold text-emerald-50">
                  {habits.best?.title ?? "No pattern yet"}
                </p>
                <p className="mt-2 text-sm leading-6 text-emerald-100/60">
                  {habits.best
                    ? `${habits.best.rate}% completion across repeated entries`
                    : "Repeated actions will become visible here."}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-sky-200/15 bg-sky-200/[0.08] p-5">
                <p className="text-sm text-sky-100/70">Needs a softer shape</p>
                <p className="mt-3 text-2xl font-semibold text-sky-50">
                  {habits.needsCare?.title ?? "No friction yet"}
                </p>
                <p className="mt-2 text-sm leading-6 text-sky-100/60">
                  {habits.needsCare
                    ? `${habits.needsCare.rate}% completion. Try making it smaller.`
                    : "Friction appears only after honest attempts."}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.08] text-stone-200">
                {bestMood ? <Leaf className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm text-stone-400">Monthly reflection</p>
                <h2 className="text-2xl font-semibold text-stone-50">Emotional completion</h2>
              </div>
            </div>

            <div
              className={`rounded-[1.75rem] border p-6 ${bestMoodVisual.border} ${bestMoodVisual.surface}`}
            >
              <p className={`text-sm ${bestMoodVisual.text}`}>
                {bestMood ? `${bestMoodOption.emoji} Highest completion mood` : "A quiet page"}
              </p>
              <p className="mt-4 text-4xl font-semibold text-stone-50">
                {bestMood ? `${bestMood.average}%` : "Soon"}
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-400">
                {bestMood
                  ? `${bestMoodOption.label} days currently carry your strongest completion signal.`
                  : "Your rhythm begins with one quiet day. Mood patterns will appear as you write."}
              </p>
            </div>
          </Card>
        </motion.div>
      </section>
    </motion.main>
  );
}
