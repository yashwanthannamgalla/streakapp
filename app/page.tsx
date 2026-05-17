"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
} from "lucide-react";

export default function Home() {

  const [currentDate, setCurrentDate] =
    useState(new Date());

  // Fake streak data
  const progressData: Record<string, boolean> = {
    "2026-05-14": false,
    "2026-05-15": true,
    "2026-05-16": false,
    "2026-05-17": true,
  };

  const month =
    currentDate.getMonth();

  const year =
    currentDate.getFullYear();

  const firstDay =
    new Date(year, month, 1).getDay();

  const daysInMonth =
    new Date(year, month + 1, 0).getDate();

  const monthName =
    currentDate.toLocaleString("default", {
      month: "long",
    });

  const days: (number | null)[] = [];

  // Empty spaces before first day
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // Check done or not
  const getStatus = (day: number) => {

    const formatted =
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return progressData[formatted];
  };

  return (

    <main className="min-h-screen bg-[#f6f6f6] flex items-center justify-center p-6">

      {/* Phone UI */}
      <div className="w-[370px] h-[760px] bg-white rounded-[45px] shadow-2xl overflow-hidden border border-neutral-200">

        {/* Top */}
        <div className="px-6 pt-6 pb-4">

          {/* Header */}
          <div className="flex items-center justify-between">

            <button
              onClick={() =>
                setCurrentDate(
                  new Date(year, month - 1)
                )
              }
              className="text-neutral-500"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="flex items-center gap-5">

              <Search
                size={20}
                className="text-neutral-500"
              />

              <Plus
                size={22}
                className="text-neutral-500"
              />

            </div>

          </div>

          {/* Month */}
          <div className="mt-5">

            <p className="text-sm text-red-500 font-medium">
              {year}
            </p>

            <h1 className="text-5xl font-bold text-black mt-1">
              {monthName}
            </h1>

          </div>

        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 px-4 mt-4 text-center text-sm text-neutral-400">

          {["S", "M", "T", "W", "T", "F", "S"].map(
            (day, index) => (
              <div key={index}>
                {day}
              </div>
            )
          )}

        </div>

        {/* Calendar */}
        <div className="grid grid-cols-7 gap-y-5 px-4 mt-6">

          {days.map((day, index) => {

            if (!day) {
              return (
                <div
                  key={index}
                  className="h-12"
                />
              );
            }

            const done =
              getStatus(day);

            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (

              <button
                key={day}
                className="
                  relative
                  h-12
                  w-12
                  mx-auto
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-[17px]
                  font-medium
                  transition-all
                "
              >

                {/* Today Circle */}
                <div
                  className={`
                    absolute
                    inset-0
                    rounded-full
                    ${
                      isToday
                        ? "bg-red-500"
                        : "bg-transparent"
                    }
                  `}
                />

                {/* Day Number */}
                <span
                  className={`
                    relative
                    z-10
                    ${
                      isToday
                        ? "text-white"
                        : "text-black"
                    }
                  `}
                >
                  {day}
                </span>

                {/* Done / Not Done Emoji */}
                {done !== undefined && (

                  <span className="absolute -bottom-3 text-[13px]">

                    {done ? "✅" : "❌"}

                  </span>

                )}

              </button>

            );

          })}

        </div>

      </div>

    </main>

  );
}