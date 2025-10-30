import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

const base =
  "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-12 px-7 text-base",
};

const variants = {
  primary:
    "bg-[#F1A501] text-white hover:bg-[#d99601] focus-visible:ring-[#F1A501]/40 shadow-lg shadow-[#F1A501]/25",
  secondary:
    "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus-visible:ring-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700",
  ghost:
    "bg-transparent text-zinc-900 hover:bg-zinc-100 focus-visible:ring-zinc-300 dark:text-white dark:hover:bg-zinc-800",
  outline:
    "bg-transparent text-zinc-900 border border-black hover:bg-black/5 focus-visible:ring-zinc-300 dark:text-white dark:border-white/80",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}


