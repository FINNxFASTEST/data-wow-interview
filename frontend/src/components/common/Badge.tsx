import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "dark" | "sage";
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({
  children,
  variant = "default",
  className,
  style,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-[5px] rounded-full text-xs font-thai",
        variant === "default" && "bg-white/90 text-forest-800",
        variant === "dark" &&
          "bg-forest-900/[0.72] text-cream-50 backdrop-blur-sm",
        variant === "sage" && "bg-moss-200 text-forest-800",
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
