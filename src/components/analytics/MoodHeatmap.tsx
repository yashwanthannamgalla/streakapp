"use client";

import { motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { DailyDataMap, MoodKey } from "@/types/day";
import { getMoodCounts, hasTrackedData } from "@/lib/calculations";
import { getLastNDays } from "@/lib/date";
import { cn } from "@/lib/cn";
import { getMoodOption, moodOptions } from "@/utils/emoji";
import { moodVisuals } from "@/lib/analytics";

type MoodHeatmapProps = {
  data: DailyDataMap;
};

type MoodTooltipPayload = {
  payload?: {
    name: string;
    value: number;
    mood: MoodKey;
  };
};

type MoodTooltipProps = {
  active?: boolean;
  payload?: MoodTooltipPayload[];
};

function MoodTooltip({ active, payload }: MoodTooltipProps) {
  const mood = payload?.[0]?.payload;

  if (!active || !mood) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950/90 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl">
      <p className="text-sm font-medium text-stone-100">{mood.name}</p>
      <p className="mt-1 text-xs text-stone-400">
        {mood.value} {mood.value === 1 ? "day" : "days"}
      </p>
    </div>
  );
}

export function MoodHeatmap({ data }: MoodHeatmapProps) {
  const days = getLastNDays(35);
  const counts = getMoodCounts(data);
  const totalMoods = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const distribution = moodOptions
    .map((mood) => ({
      mood: mood.key,
      name: `${mood.emoji} ${mood.label}`,
      value: counts[mood.key],
      fill: moodVisuals[mood.key].chart,
    }))
    .filter((mood) => mood.value > 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_180px]">
      <div className="grid grid-cols-7 gap-2">
        {days.map((dateKey, index) => {
          const entry = data[dateKey];
          const tracked = hasTrackedData(entry);
          const mood = getMoodOption(entry?.mood);
          const visual = moodVisuals[mood.key];

          return (
            <motion.div
              className={cn(
                "grid aspect-square min-h-10 place-items-center rounded-2xl border text-sm transition-colors duration-300",
                tracked
                  ? `${visual.surface} ${visual.border} ${visual.text} ${visual.glow}`
                  : "border-white/10 bg-white/[0.035] text-stone-700",
              )}
              initial={{ opacity: 0, scale: 0.92 }}
              key={dateKey}
              title={`${dateKey}${tracked ? `: ${mood.label}` : ""}`}
              transition={{ delay: index * 0.012, duration: 0.45, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={tracked ? { scale: 1.08, y: -2 } : { scale: 1.03 }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              {tracked ? mood.emoji : ""}
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="h-40">
          {totalMoods > 0 ? (
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Tooltip content={<MoodTooltip />} />
                <Pie
                  animationBegin={280}
                  animationDuration={1100}
                  cornerRadius={8}
                  data={distribution}
                  dataKey="value"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={4}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={1}
                >
                  {distribution.map((mood) => (
                    <Cell fill={mood.fill} key={mood.mood} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-full place-items-center rounded-[1.5rem] border border-white/10 bg-white/[0.035] px-4 text-center">
              <p className="text-sm leading-6 text-stone-500">Mood will appear once a day is written.</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {moodOptions.map((mood) => {
            const visual = moodVisuals[mood.key];
            const percent = totalMoods === 0 ? 0 : Math.round((counts[mood.key] / totalMoods) * 100);

            return (
              <div className="flex items-center gap-2" key={mood.key}>
                <span className={cn("h-2.5 w-2.5 rounded-full", visual.surface)} />
                <span className="w-20 text-xs text-stone-400">
                  {mood.emoji} {mood.label}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    style={{ backgroundColor: visual.chart }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    whileInView={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
