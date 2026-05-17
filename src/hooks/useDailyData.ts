"use client";

import { useMemo } from "react";
import { STORAGE_KEY, localStoragePort } from "@/lib/storage";
import { createEmptyDay, updateDayEntry } from "@/lib/calculations";
import { getTodayKey } from "@/lib/date";
import type { DailyDataMap, MoodKey } from "@/types/day";
import type { Task } from "@/types/task";
import { useLocalStorage } from "./useLocalStorage";

const EMPTY_DAILY_DATA: DailyDataMap = {};

function createTask(title: string): Task {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

export function useDailyData(dateKey = getTodayKey()) {
  const [data, setData, isReady] = useLocalStorage<DailyDataMap>(
    STORAGE_KEY,
    EMPTY_DAILY_DATA,
  );

  const day = useMemo(() => data[dateKey] ?? createEmptyDay(dateKey), [data, dateKey]);

  function addTask(title: string) {
    const trimmed = title.trim();

    if (!trimmed) {
      return;
    }

    setData((current) =>
      updateDayEntry(current, dateKey, (entry) => ({
        ...entry,
        tasks: [...entry.tasks, createTask(trimmed)],
      })),
    );
  }

  function toggleTask(taskId: string) {
    setData((current) =>
      updateDayEntry(current, dateKey, (entry) => ({
        ...entry,
        tasks: entry.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? new Date().toISOString() : undefined,
              }
            : task,
        ),
      })),
    );
  }

  function deleteTask(taskId: string) {
    setData((current) =>
      updateDayEntry(current, dateKey, (entry) => ({
        ...entry,
        tasks: entry.tasks.filter((task) => task.id !== taskId),
      })),
    );
  }

  function updateReflection(reflection: string) {
    setData((current) =>
      updateDayEntry(current, dateKey, (entry) => ({
        ...entry,
        reflection,
      })),
    );
  }

  function updateMood(mood: MoodKey) {
    setData((current) =>
      updateDayEntry(current, dateKey, (entry) => ({
        ...entry,
        mood,
      })),
    );
  }

  function clearAllData() {
    localStoragePort.clear();
    setData({});
  }

  return {
    data,
    day,
    isReady,
    setData,
    addTask,
    toggleTask,
    deleteTask,
    updateReflection,
    updateMood,
    clearAllData,
  };
}
