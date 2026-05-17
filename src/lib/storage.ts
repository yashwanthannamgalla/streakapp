import type { DailyDataMap } from "@/types/day";

export const STORAGE_KEY = "streakapp:v1:daily-data";
export const STORAGE_EVENT = "streakapp-storage";

export type StoragePort = {
  read: () => DailyDataMap;
  write: (data: DailyDataMap) => void;
  clear: () => void;
};

export const localStoragePort: StoragePort = {
  read() {
    if (typeof window === "undefined") {
      return {};
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(raw) as DailyDataMap;
    } catch {
      return {};
    }
  },
  write(data) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  },
  clear() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(STORAGE_EVENT));
  },
};
