import type { MoodOption } from "@/types/day";

export const moodOptions: MoodOption[] = [
  {
    key: "calm",
    emoji: "🌿",
    label: "Calm",
    tone: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  },
  {
    key: "focused",
    emoji: "⚡",
    label: "Focused",
    tone: "border-yellow-300/30 bg-yellow-300/10 text-yellow-100",
  },
  {
    key: "heavy",
    emoji: "🌧️",
    label: "Heavy",
    tone: "border-sky-300/25 bg-sky-300/10 text-sky-100",
  },
  {
    key: "proud",
    emoji: "✨",
    label: "Proud",
    tone: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  },
  {
    key: "reset",
    emoji: "🌙",
    label: "Reset",
    tone: "border-violet-300/30 bg-violet-300/10 text-violet-100",
  },
];

export function getMoodOption(key: string | undefined): MoodOption {
  return moodOptions.find((option) => option.key === key) ?? moodOptions[0];
}

export function getCompletionEmoji(completion: number, taskCount: number): string {
  if (taskCount === 0) {
    return "🌙";
  }

  if (completion >= 95) {
    return "🔥";
  }

  if (completion >= 75) {
    return "✅";
  }

  if (completion >= 45) {
    return "🌱";
  }

  if (completion > 0) {
    return "🧭";
  }

  return "💭";
}

export function getCompletionLabel(completion: number, taskCount: number): string {
  if (taskCount === 0) {
    return "Unwritten";
  }

  if (completion >= 95) {
    return "Locked in";
  }

  if (completion >= 75) {
    return "Kept";
  }

  if (completion >= 45) {
    return "Building";
  }

  if (completion > 0) {
    return "Starting";
  }

  return "Unkept";
}
