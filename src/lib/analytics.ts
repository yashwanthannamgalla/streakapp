import type { DailyDataMap, DayEntry, MoodKey } from "@/types/day";
import {
  calculateMonthAverage,
  calculateStreaks,
  getMoodCounts,
  getWeeklySeries,
  hasTrackedData,
} from "./calculations";
import { getLastNDays, parseDateKey } from "./date";
import { getMoodOption } from "@/utils/emoji";

export type MoodVisual = {
  surface: string;
  border: string;
  text: string;
  glow: string;
  chart: string;
};

export type BehavioralInsight = {
  eyebrow: string;
  title: string;
  body: string;
};

export type ConsistencyIdentity = {
  name: "Quiet Builder" | "Focus Keeper" | "Steady Mind" | "Recovery Arc";
  subtitle: string;
  body: string;
  accent: string;
};

export const moodVisuals: Record<MoodKey, MoodVisual> = {
  calm: {
    surface: "bg-emerald-300/10",
    border: "border-emerald-200/20",
    text: "text-emerald-100",
    glow: "shadow-[0_18px_70px_rgba(134,167,137,0.18)]",
    chart: "#86a789",
  },
  focused: {
    surface: "bg-yellow-300/10",
    border: "border-yellow-200/20",
    text: "text-yellow-100",
    glow: "shadow-[0_18px_70px_rgba(231,196,106,0.16)]",
    chart: "#e7c46a",
  },
  heavy: {
    surface: "bg-sky-300/10",
    border: "border-sky-200/20",
    text: "text-sky-100",
    glow: "shadow-[0_18px_70px_rgba(143,164,184,0.13)]",
    chart: "#8fa4b8",
  },
  proud: {
    surface: "bg-amber-300/10",
    border: "border-amber-200/20",
    text: "text-amber-100",
    glow: "shadow-[0_18px_70px_rgba(233,184,114,0.16)]",
    chart: "#e9b872",
  },
  reset: {
    surface: "bg-violet-300/10",
    border: "border-violet-200/20",
    text: "text-violet-100",
    glow: "shadow-[0_18px_70px_rgba(165,138,199,0.14)]",
    chart: "#a58ac7",
  },
};

export function getTrackedEntries(data: DailyDataMap): DayEntry[] {
  return Object.values(data)
    .filter(hasTrackedData)
    .sort((left, right) => left.date.localeCompare(right.date));
}

export function getAverageCompletion(entries: DayEntry[]): number {
  if (entries.length === 0) {
    return 0;
  }

  return Math.round(
    entries.reduce((total, entry) => total + entry.completion, 0) / entries.length,
  );
}

export function getMoodAverages(data: DailyDataMap) {
  const grouped = getTrackedEntries(data).reduce(
    (acc, entry) => {
      acc[entry.mood].count += 1;
      acc[entry.mood].completion += entry.completion;
      return acc;
    },
    {
      calm: { count: 0, completion: 0 },
      focused: { count: 0, completion: 0 },
      heavy: { count: 0, completion: 0 },
      proud: { count: 0, completion: 0 },
      reset: { count: 0, completion: 0 },
    } satisfies Record<MoodKey, { count: number; completion: number }>,
  );

  return Object.entries(grouped).map(([mood, stats]) => ({
    mood: mood as MoodKey,
    count: stats.count,
    average: stats.count === 0 ? 0 : Math.round(stats.completion / stats.count),
  }));
}

export function getDominantMood(data: DailyDataMap) {
  const counts = getMoodCounts(data);

  return (Object.entries(counts) as Array<[MoodKey, number]>).sort(
    (left, right) => right[1] - left[1],
  )[0];
}

export function getBestMood(data: DailyDataMap) {
  return getMoodAverages(data)
    .filter((mood) => mood.count > 0)
    .sort((left, right) => right.average - left.average || right.count - left.count)[0];
}

function splitByWeekend(entries: DayEntry[]) {
  return entries.reduce(
    (acc, entry) => {
      const day = parseDateKey(entry.date).getDay();
      const target = day === 0 || day === 6 ? acc.weekend : acc.weekday;
      target.push(entry);
      return acc;
    },
    { weekday: [] as DayEntry[], weekend: [] as DayEntry[] },
  );
}

function getMomentumInsight(data: DailyDataMap): BehavioralInsight | undefined {
  const days = getLastNDays(14).map((dateKey) => data[dateKey]).filter(hasTrackedData);

  if (days.length < 4) {
    return undefined;
  }

  const midpoint = Math.floor(days.length / 2);
  const earlier = getAverageCompletion(days.slice(0, midpoint));
  const recent = getAverageCompletion(days.slice(midpoint));
  const delta = recent - earlier;

  if (delta >= 8) {
    return {
      eyebrow: "Quiet momentum",
      title: "Momentum improved this week.",
      body: "Your recent days are carrying a little more follow-through than the days before them.",
    };
  }

  if (delta <= -10) {
    return {
      eyebrow: "Recovery rhythm",
      title: "This week is asking for a softer pace.",
      body: "Your signal dipped recently. A smaller promise may help the rhythm return without force.",
    };
  }

  return {
    eyebrow: "Steady line",
    title: "Your rhythm is holding steady.",
    body: "The week looks even. Keep the next step simple enough to repeat.",
  };
}

export function getBehavioralInsights(data: DailyDataMap): BehavioralInsight[] {
  const entries = getTrackedEntries(data);

  if (entries.length === 0) {
    return [
      {
        eyebrow: "First signal",
        title: "Your rhythm begins with one quiet day.",
        body: "Add a small commitment, mark what happened, and let the pattern introduce itself.",
      },
      {
        eyebrow: "Reflection",
        title: "The system is ready to listen.",
        body: "Mood and notes will turn ordinary days into a personal map over time.",
      },
      {
        eyebrow: "Identity",
        title: "No pressure to be perfect.",
        body: "StreakApp rewards visible return, not constant intensity.",
      },
    ];
  }

  const insights: BehavioralInsight[] = [];
  const { weekday, weekend } = splitByWeekend(entries);

  if (weekday.length > 0 && weekend.length > 0) {
    const weekdayAverage = getAverageCompletion(weekday);
    const weekendAverage = getAverageCompletion(weekend);

    if (weekendAverage >= weekdayAverage + 8) {
      insights.push({
        eyebrow: "Weekly rhythm",
        title: "You are more consistent on weekends.",
        body: "Open space seems to help your follow-through. Consider protecting one weekend-style block during the week.",
      });
    } else if (weekdayAverage >= weekendAverage + 8) {
      insights.push({
        eyebrow: "Weekly rhythm",
        title: "Weekdays are carrying your rhythm.",
        body: "Structure appears to help. A lighter weekend ritual may keep the chain feeling humane.",
      });
    }
  }

  const momentum = getMomentumInsight(data);

  if (momentum) {
    insights.push(momentum);
  }

  const bestMood = getBestMood(data);

  if (bestMood) {
    const mood = getMoodOption(bestMood.mood);
    insights.push({
      eyebrow: "Emotional pattern",
      title: `Your ${mood.label.toLowerCase()} days have the highest completion rate.`,
      body: `${mood.emoji} ${bestMood.average}% average completion. This mood may be a useful starting point for planning harder tasks.`,
    });
  }

  if (entries.length < 3) {
    insights.push({
      eyebrow: "Early signal",
      title: "The pattern is still becoming visible.",
      body: "A few more tracked days will make the reflection sharper.",
    });
  }

  return insights.slice(0, 3);
}

export function getConsistencyIdentity(data: DailyDataMap): ConsistencyIdentity {
  const entries = getTrackedEntries(data);
  const streaks = calculateStreaks(data);
  const monthAverage = calculateMonthAverage(data);
  const dominantMood = getDominantMood(data);

  if (entries.length === 0) {
    return {
      name: "Quiet Builder",
      subtitle: "A calm system before the first signal",
      body: "Your consistency identity will emerge from small, honest entries.",
      accent: "from-stone-200/20 via-lime-200/10 to-transparent",
    };
  }

  if (dominantMood?.[0] === "focused" && monthAverage >= 70) {
    return {
      name: "Focus Keeper",
      subtitle: "Clear energy, protected attention",
      body: "Focused days are becoming a reliable place for meaningful work.",
      accent: "from-yellow-200/20 via-amber-200/10 to-transparent",
    };
  }

  if (dominantMood && ["heavy", "reset"].includes(dominantMood[0])) {
    return {
      name: "Recovery Arc",
      subtitle: "Returning without self-punishment",
      body: "Your pattern includes recovery. That is still a form of consistency.",
      accent: "from-violet-200/20 via-sky-200/10 to-transparent",
    };
  }

  if (streaks.currentStreak >= 3 || monthAverage >= 75) {
    return {
      name: "Steady Mind",
      subtitle: "Quiet momentum, repeated calmly",
      body: "Your recent behavior is starting to look like trust in motion.",
      accent: "from-emerald-200/20 via-lime-200/10 to-transparent",
    };
  }

  return {
    name: "Quiet Builder",
    subtitle: "Small proof, honestly recorded",
    body: "The foundation is forming through ordinary days made visible.",
    accent: "from-stone-200/20 via-emerald-200/10 to-transparent",
  };
}

export function getAnalyticsSummary(data: DailyDataMap) {
  const entries = getTrackedEntries(data);
  const weekly = getWeeklySeries(data);
  const trackedThisWeek = weekly.filter((day) => day.hasData).length;

  return {
    entries,
    trackedDays: entries.length,
    trackedThisWeek,
    average: getAverageCompletion(entries),
  };
}
