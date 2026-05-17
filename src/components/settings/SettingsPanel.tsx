"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, Database, Download, RotateCcw, ShieldCheck, Snowflake, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useDailyData } from "@/hooks/useDailyData";
import { getTodayKey } from "@/lib/date";

export function SettingsPanel() {
  const { data, clearAllData } = useDailyData(getTodayKey());
  const [confirmOpen, setConfirmOpen] = useState(false);

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "streakapp-data.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function resetData() {
    clearAllData();
    setConfirmOpen(false);
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-black/20 p-5 shadow-[0_22px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              aria-label="Back to calendar"
              icon={<ArrowLeft className="h-4 w-4" />}
              size="icon"
              type="button"
              variant="ghost"
            />
          </Link>
          <div>
            <p className="text-sm text-stone-400">Settings</p>
            <h1 className="mt-1 text-3xl font-semibold text-stone-50 sm:text-4xl">
              Personal system
            </h1>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <p className="text-sm text-stone-400">Data</p>
          <div className="mt-5 grid gap-3">
            <button className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-left transition duration-200 hover:bg-white/[0.07]" type="button">
              <span className="flex items-center gap-3">
                <Database className="h-5 w-5 text-lime-100" />
                <span>
                  <span className="block font-medium text-stone-100">Storage</span>
                  <span className="text-sm text-stone-500">Local device</span>
                </span>
              </span>
              <ShieldCheck className="h-5 w-5 text-stone-500" />
            </button>
            <button className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-left transition duration-200 hover:bg-white/[0.07]" type="button">
              <span className="flex items-center gap-3">
                <UserRound className="h-5 w-5 text-sky-100" />
                <span>
                  <span className="block font-medium text-stone-100">Account</span>
                  <span className="text-sm text-stone-500">Supabase-ready</span>
                </span>
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400">
                Later
              </span>
            </button>
            <button className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-left transition duration-200 hover:bg-white/[0.07]" type="button">
              <span className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-amber-100" />
                <span>
                  <span className="block font-medium text-stone-100">Reminders</span>
                  <span className="text-sm text-stone-500">Quiet nudges</span>
                </span>
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400">
                Later
              </span>
            </button>
            <button className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-left transition duration-200 hover:bg-white/[0.07]" type="button">
              <span className="flex items-center gap-3">
                <Snowflake className="h-5 w-5 text-violet-100" />
                <span>
                  <span className="block font-medium text-stone-100">Streak freezes</span>
                  <span className="text-sm text-stone-500">Recovery days</span>
                </span>
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400">
                Later
              </span>
            </button>
          </div>
        </Card>

        <aside className="flex flex-col gap-6">
          <Card>
            <p className="text-sm text-stone-400">Portable journal</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-50">
              {Object.keys(data).length} days saved
            </h2>
            <div className="mt-5 flex flex-col gap-3">
              <Button
                icon={<Download className="h-4 w-4" />}
                onClick={exportData}
                type="button"
                variant="secondary"
              >
                Export JSON
              </Button>
              <Button
                icon={<RotateCcw className="h-4 w-4" />}
                onClick={() => setConfirmOpen(true)}
                type="button"
                variant="danger"
              >
                Reset data
              </Button>
            </div>
          </Card>
        </aside>
      </section>

      <Modal onClose={() => setConfirmOpen(false)} open={confirmOpen} title="Reset StreakApp">
        <p className="text-sm leading-6 text-stone-400">
          This clears every local day entry, task, mood, and reflection from this browser.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button onClick={() => setConfirmOpen(false)} type="button" variant="ghost">
            Cancel
          </Button>
          <Button onClick={resetData} type="button" variant="danger">
            Reset
          </Button>
        </div>
      </Modal>
    </main>
  );
}
