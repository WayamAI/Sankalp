import * as React from "react";

import { cn } from "@/lib/utils";
import type { IconName } from "@/lib/icons";
import { AppIcon, type IconSize } from "./app-icon";

const variants = {
  ghost:
    "bg-action-tertiary text-icon-tertiary hover:bg-action-tertiary-hover hover:text-icon-secondary active:bg-action-tertiary-focused active:text-icon-primary",
  subtle: "bg-action text-icon-secondary hover:bg-raised-2 hover:text-icon-primary",
  inverse: "bg-action-primary text-icon-on-color hover:bg-action-primary-hover",
} as const;

const boxSizes = { sm: "h-8 w-8", md: "h-9 w-9", lg: "h-10 w-10" } as const;
const glyphSizes: Record<keyof typeof boxSizes, IconSize> = { sm: "sm", md: "md", lg: "lg" };

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  /** Required accessible name for the icon-only control. */
  label: string;
  variant?: keyof typeof variants;
  size?: keyof typeof boxSizes;
  shape?: "rounded" | "circle";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, variant = "ghost", size = "md", shape = "rounded", className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:text-icon-quaternary",
        shape === "circle" ? "rounded-full" : "rounded-lg",
        boxSizes[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      <AppIcon name={icon} size={glyphSizes[size]} />
    </button>
  ),
);
IconButton.displayName = "IconButton";
