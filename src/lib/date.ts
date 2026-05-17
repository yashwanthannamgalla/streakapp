const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  if (!DATE_KEY_PATTERN.test(dateKey)) {
    return new Date();
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function isDateKey(value: string): boolean {
  return DATE_KEY_PATTERN.test(value);
}

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

export function addDays(dateKey: string, amount: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  return formatDateKey(date);
}

export function isSameMonth(date: Date, activeDate: Date): boolean {
  return (
    date.getMonth() === activeDate.getMonth() &&
    date.getFullYear() === activeDate.getFullYear()
  );
}

export function isSameDate(left: Date, right: Date): boolean {
  return formatDateKey(left) === formatDateKey(right);
}

export function formatLongDate(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function getLastNDays(count: number, endKey = getTodayKey()): string[] {
  return Array.from({ length: count }, (_, index) =>
    addDays(endKey, index - count + 1),
  );
}

export function getMonthKeys(date: Date): string[] {
  const cursor = new Date(date.getFullYear(), date.getMonth(), 1);
  const keys: string[] = [];

  while (cursor.getMonth() === date.getMonth()) {
    keys.push(formatDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return keys;
}
