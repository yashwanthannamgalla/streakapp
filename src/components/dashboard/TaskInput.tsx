"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

type TaskInputProps = {
  onAddTask: (title: string) => void;
};

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAddTask(title);
    setTitle("");
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <input
        className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-stone-50 outline-none transition duration-200 placeholder:text-stone-600 focus:border-lime-200/40 focus:bg-black/30"
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Add a meaningful action"
        value={title}
      />
      <Button
        disabled={!title.trim()}
        icon={<Plus className="h-4 w-4" />}
        type="submit"
        variant="primary"
      >
        Add
      </Button>
    </form>
  );
}
