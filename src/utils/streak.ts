import type { DailyDataMap } from "@/types/day";
import { calculateStreaks, isSuccessfulDay } from "@/lib/calculations";

export function getCurrentStreak(data: DailyDataMap): number {
  return calculateStreaks(data).currentStreak;
}

export function getLongestStreak(data: DailyDataMap): number {
  return calculateStreaks(data).longestStreak;
}

export function getStreakContribution(data: DailyDataMap, dateKey: string): number {
  const entry = data[dateKey];
  return isSuccessfulDay(entry) ? entry?.contribution ?? 0 : 0;
}
