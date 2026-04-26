import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "dark" | "ghost";
  size?: "default" | "lg";
  block?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "default",
  block = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-transparent cursor-pointer text-sm font-medium transition-all duration-150",
        size === "default" && "px-[22px] py-3",
        size === "lg" && "px-7 py-4 text-[15px]",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent",
        variant === "dark" &&
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border",
        variant === "ghost" &&
          "bg-transparent text-foreground hover:bg-muted border-border/60",
        block && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
