"use client";

import { Check, Circle, Trash2 } from "lucide-react";
import type { Task } from "@/types/task";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type TaskCardProps = {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
};

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <div className="group flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.045] p-3 transition duration-200 hover:border-white/15 hover:bg-white/[0.075]">
      <button
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition duration-200",
          task.completed
            ? "border-lime-200/30 bg-lime-200 text-neutral-950"
            : "border-white/10 bg-black/15 text-stone-400 hover:text-stone-100",
        )}
        onClick={() => onToggle(task.id)}
        type="button"
      >
        {task.completed ? <Check className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "break-words text-sm font-medium transition duration-200",
            task.completed ? "text-stone-400 line-through" : "text-stone-50",
          )}
        >
          {task.title}
        </p>
      </div>
      <Button
        aria-label="Delete task"
        icon={<Trash2 className="h-4 w-4" />}
        onClick={() => onDelete(task.id)}
        size="icon"
        type="button"
        variant="ghost"
      />
    </div>
  );
}
