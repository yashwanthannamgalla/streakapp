import type { DailyDataMap, DayEntry, MoodKey } from "@/types/day";
import type { Task } from "@/types/task";
import { addDays, formatShortDate, getLastNDays, getMonthKeys, getTodayKey } from "./date";
import { getCompletionEmoji } from "@/utils/emoji";

export const SUCCESS_THRESHOLD = 75;

export function calculateCompletion(tasks: Task[]): number {
  if (tasks.length === 0) {
    return 0;
  }

  const completed = tasks.filter((task) => task.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

export function getContributionLevel(completion: number, hasData: boolean): number {
  if (!hasData) {
    return 0;
  }

  if (completion >= 95) {
    return 4;
  }

  if (completion >= SUCCESS_THRESHOLD) {
    return 3;
  }

  if (completion >= 45) {
    return 2;
  }

  return 1;
}

export function hasTrackedData(entry?: DayEntry): boolean {
  if (!entry) {
    return false;
  }

  return entry.tasks.length > 0 || entry.reflection.trim().length > 0;
}

export function isSuccessfulDay(entry?: DayEntry): boolean {
  return Boolean(entry && hasTrackedData(entry) && entry.completion >= SUCCESS_THRESHOLD);
}

export function createEmptyDay(date: string): DayEntry {
  return {
    date,
    tasks: [],
    completion: 0,
    emoji: getCompletionEmoji(0, 0),
    mood: "calm",
    reflection: "",
    contribution: 0,
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeDay(entry: DayEntry): DayEntry {
  const completion = calculateCompletion(entry.tasks);
  const hasData = entry.tasks.length > 0 || entry.reflection.trim().length > 0;

  return {
    ...entry,
    completion,
    emoji: getCompletionEmoji(completion, entry.tasks.length),
    contribution: getContributionLevel(completion, hasData),
    updatedAt: new Date().toISOString(),
  };
}

export function updateDayEntry(
  data: DailyDataMap,
  date: string,
  updater: (entry: DayEntry) => DayEntry,
): DailyDataMap {
  const current = data[date] ?? createEmptyDay(date);
  const next = normalizeDay(updater(current));

  return {
    ...data,
    [date]: next,
  };
}

export function calculateStreaks(data: DailyDataMap) {
  const successfulKeys = Object.keys(data)
    .filter((dateKey) => isSuccessfulDay(data[dateKey]))
    .sort();

  let longestStreak = 0;
  let rollingStreak = 0;
  let previousKey = "";

  for (const key of successfulKeys) {
    rollingStreak = previousKey && addDays(previousKey, 1) === key ? rollingStreak + 1 : 1;
    longestStreak = Math.max(longestStreak, rollingStreak);
    previousKey = key;
  }

  let cursor = getTodayKey();

  if (!isSuccessfulDay(data[cursor])) {
    cursor = addDays(cursor, -1);
  }

  let currentStreak = 0;

  while (isSuccessfulDay(data[cursor])) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  return {
    currentStreak,
    longestStreak,
  };
}

export function calculateMonthAverage(data: DailyDataMap, monthDate = new Date()): number {
  const entries = getMonthKeys(monthDate)
    .map((key) => data[key])
    .filter(hasTrackedData);

  if (entries.length === 0) {
    return 0;
  }

  const total = entries.reduce((sum, entry) => sum + entry.completion, 0);
  return Math.round(total / entries.length);
}

export function getWeeklySeries(data: DailyDataMap, days = 7) {
  return getLastNDays(days).map((dateKey) => {
    const entry = data[dateKey];

    return {
      date: dateKey,
      label: formatShortDate(dateKey),
      completion: entry?.completion ?? 0,
      hasData: hasTrackedData(entry),
      successful: isSuccessfulDay(entry),
    };
  });
}

export function getMoodCounts(data: DailyDataMap): Record<MoodKey, number> {
  return Object.values(data).reduce(
    (counts, entry) => {
      if (hasTrackedData(entry)) {
        counts[entry.mood] += 1;
      }

      return counts;
    },
    {
      calm: 0,
      focused: 0,
      heavy: 0,
      proud: 0,
      reset: 0,
    },
  );
}

export function getHabitInsights(data: DailyDataMap) {
  const habits = new Map<string, { title: string; total: number; completed: number }>();

  for (const entry of Object.values(data)) {
    for (const task of entry.tasks) {
      const key = task.title.trim().toLowerCase();

      if (!key) {
        continue;
      }

      const current = habits.get(key) ?? {
        title: task.title.trim(),
        total: 0,
        completed: 0,
      };

      current.total += 1;
      current.completed += task.completed ? 1 : 0;
      habits.set(key, current);
    }
  }

  const ranked = Array.from(habits.values()).map((habit) => ({
    ...habit,
    rate: habit.total === 0 ? 0 : Math.round((habit.completed / habit.total) * 100),
  }));

  return {
    best: [...ranked].sort((a, b) => b.rate - a.rate || b.total - a.total)[0],
    needsCare: [...ranked].sort((a, b) => a.rate - b.rate || b.total - a.total)[0],
  };
}

export function calculateTotalTasks(data: DailyDataMap) {
  return Object.values(data).reduce(
    (totals, entry) => {
      totals.total += entry.tasks.length;
      totals.completed += entry.tasks.filter((task) => task.completed).length;
      return totals;
    },
    { total: 0, completed: 0 },
  );
}
