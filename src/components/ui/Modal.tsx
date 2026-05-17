"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-neutral-950 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-stone-50">{title}</h2>
          <Button
            aria-label="Close"
            icon={<X className="h-4 w-4" />}
            onClick={onClose}
            size="icon"
            type="button"
            variant="ghost"
          />
        </div>
        {children}
      </div>
    </div>
  );
}
