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
        "inline-flex items-center justify-center gap-2 rounded-full border border-transparent cursor-pointer font-thai text-sm font-medium transition-all duration-150",
        size === "default" && "px-[22px] py-3",
        size === "lg" && "px-7 py-4 text-[15px]",
        variant === "primary" &&
          "bg-ember text-cream-50 hover:bg-ember-dark border-transparent",
        variant === "dark" && "bg-forest-800 text-cream-50 border-transparent",
        variant === "ghost" &&
          "bg-transparent text-ink hover:bg-cream-100",
        variant === "ghost" && "border-[rgba(27,38,32,0.22)]",
        block && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
