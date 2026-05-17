import type { DayEntry } from "@/types/day";
import { hasTrackedData, isSuccessfulDay } from "@/lib/calculations";

type CalendarTileProps = {
  entry?: DayEntry;
};

export function CalendarTile({ entry }: CalendarTileProps) {
  if (!hasTrackedData(entry)) {
    return null;
  }

  const successful = isSuccessfulDay(entry);

  return (
    <span
      aria-label={successful ? "Kept day" : "Missed day"}
      className="calendar-status"
    >
      {successful ? "✅" : "❌"}
    </span>
  );
}
