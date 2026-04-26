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
        "inline-flex items-center gap-1.5 px-3 py-[5px] rounded-full text-xs font-medium",
        variant === "default" &&
          "bg-card/90 text-foreground border border-border/80 backdrop-blur-sm",
        variant === "dark" &&
          "bg-primary/85 text-primary-foreground backdrop-blur-sm border border-transparent",
        variant === "sage" && "bg-muted text-foreground border border-border/60",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}
