import * as React from "react";

import { cn } from "@/lib/utils";
import { icons, type IconName } from "@/lib/icons";

const sizes = {
  xs: "var(--icon-size-xs)",
  sm: "var(--icon-size-sm)",
  md: "var(--icon-size-md)",
  lg: "var(--icon-size-lg)",
  xl: "var(--icon-size-xl)",
  "2xl": "var(--icon-size-2xl)",
  "3xl": "var(--icon-size-3xl)",
} as const;

export type IconSize = keyof typeof sizes;

export interface AppIconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  name: IconName;
  size?: IconSize;
  /** Accessible name; when omitted the icon is treated as decorative. */
  "aria-label"?: string;
}

export function AppIcon({ name, size = "md", className, style, ...props }: AppIconProps) {
  const Icon = icons[name];
  const label = props["aria-label"];
  return (
    <Icon
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      className={cn("inline-block shrink-0", className)}
      style={{ width: sizes[size], height: sizes[size], ...style }}
      {...props}
    />
  );
}
