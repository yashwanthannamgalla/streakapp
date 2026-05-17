import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-white/10 bg-white text-neutral-950 shadow-[0_18px_60px_rgba(255,255,255,0.12)] hover:bg-stone-100",
  secondary:
    "border-white/10 bg-white/[0.07] text-stone-100 hover:border-white/20 hover:bg-white/[0.1]",
  ghost:
    "border-transparent bg-transparent text-stone-300 hover:bg-white/[0.07] hover:text-white",
  danger:
    "border-rose-300/20 bg-rose-400/10 text-rose-100 hover:bg-rose-400/15",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  icon: "h-10 w-10 justify-center p-0",
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-40",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
