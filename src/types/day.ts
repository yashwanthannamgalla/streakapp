import type { Task } from "./task";

export type MoodKey = "calm" | "focused" | "heavy" | "proud" | "reset";

export type MoodOption = {
  key: MoodKey;
  emoji: string;
  label: string;
  tone: string;
};

export type DayEntry = {
  date: string;
  tasks: Task[];
  completion: number;
  emoji: string;
  mood: MoodKey;
  reflection: string;
  contribution: number;
  updatedAt: string;
};

export type DailyDataMap = Record<string, DayEntry>;
