"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { parseDateKey } from "@/lib/date";

type WeeklyDatum = {
  date: string;
  label: string;
  completion: number;
  hasData: boolean;
  successful: boolean;
};

type ChartDatum = WeeklyDatum & {
  dayLabel: string;
  chartValue: number;
};

type TooltipPayload = {
  payload?: ChartDatum;
};

type WeeklyTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
};

type WeeklyChartProps = {
  data: WeeklyDatum[];
};

function WeeklyTooltip({ active, payload }: WeeklyTooltipProps) {
  const day = payload?.[0]?.payload;

  if (!active || !day) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950/90 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl">
      <p className="text-sm font-medium text-stone-100">{day.label}</p>
      <p className="mt-1 text-xs text-stone-400">
        {day.hasData ? `${day.completion}% completion` : "No entry yet"}
      </p>
    </div>
  );
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const rawGradientId = useId();
  const gradientId = `weekly-${rawGradientId.replace(/:/g, "")}`;
  const hasAnyData = data.some((day) => day.hasData);
  const chartData: ChartDatum[] = data.map((day) => ({
    ...day,
    dayLabel: parseDateKey(day.date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    chartValue: Math.max(day.hasData ? day.completion : 8, 8),
  }));

  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/15 p-4 sm:p-5">
      <div className="pointer-events-none absolute inset-x-8 top-8 h-28 rounded-full bg-lime-200/5 blur-3xl" />
      <ResponsiveContainer height={248} width="100%">
        <BarChart data={chartData} margin={{ bottom: 4, left: -28, right: 8, top: 16 }}>
          <defs>
            <linearGradient id={`${gradientId}-success`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#d9f99d" stopOpacity={0.96} />
              <stop offset="100%" stopColor="#86a789" stopOpacity={0.54} />
            </linearGradient>
            <linearGradient id={`${gradientId}-soft`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#b8c2ad" stopOpacity={0.46} />
              <stop offset="100%" stopColor="#8fa4b8" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 10" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="dayLabel"
            tick={{ fill: "rgba(231,229,228,0.46)", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis domain={[0, 100]} hide />
          <Tooltip content={<WeeklyTooltip />} cursor={{ fill: "rgba(255,255,255,0.035)" }} />
          <Bar
            animationBegin={180}
            animationDuration={1200}
            dataKey="chartValue"
            radius={[16, 16, 16, 16]}
            style={{ filter: "drop-shadow(0 12px 24px rgba(217,249,157,0.12))" }}
          >
            {chartData.map((day) => (
              <Cell
                fill={
                  day.hasData
                    ? day.successful
                      ? `url(#${gradientId}-success)`
                      : `url(#${gradientId}-soft)`
                    : "rgba(255,255,255,0.075)"
                }
                key={day.date}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {!hasAnyData ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-x-6 top-1/2 mx-auto max-w-sm -translate-y-1/2 rounded-[1.5rem] border border-white/10 bg-neutral-950/70 p-5 text-center shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-sm font-medium text-stone-100">Your rhythm begins with one quiet day.</p>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            Track a task and this chart will start to breathe.
          </p>
        </motion.div>
      ) : null}
    </div>
  );
}
