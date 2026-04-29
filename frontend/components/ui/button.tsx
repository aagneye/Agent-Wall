import * as React from "react";
import { cn } from "@/utils/cn";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition",
        variant === "primary"
          ? "bg-indigo-500 text-white hover:bg-indigo-400"
          : "bg-slate-800 text-slate-100 hover:bg-slate-700",
        className
      )}
      {...props}
    />
  );
}
