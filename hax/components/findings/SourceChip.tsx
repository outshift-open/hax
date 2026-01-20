"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SourceChipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The text label to display in the chip */
  label: string;
  /** Maximum width for the chip - text will truncate with ellipsis if exceeded */
  maxWidth?: number | string;
  /** Whether this is a count chip (e.g., "+3") - uses slightly different styling */
  isCountChip?: boolean;
  /** Whether to allow the chip to shrink and truncate text when container is constrained */
  truncate?: boolean;
}

/**
 * SourceChip - An atomic chip component for displaying source labels
 *
 * Uses Figma design system variables:
 * - Font: paragraph/mini (12px, 16px line-height, semibold)
 * - Border: unofficial/border-3 (#cbd5e1)
 * - Background: unofficial/outline (rgba(255,255,255,0.1))
 * - Border radius: semantic/rounded-lg (8px)
 * - Shadow: xs shadow
 *
 * Features:
 * - Truncation support: Set maxWidth to truncate long labels with ellipsis
 * - Count chip variant: For "+N" overflow indicators
 */
export function SourceChip({
  label,
  maxWidth,
  isCountChip = false,
  truncate = false,
  className,
  style,
  ...props
}: SourceChipProps) {
  const chipStyle: React.CSSProperties = {
    ...style,
    ...(maxWidth ? { maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth } : {}),
  };

  // Determine if truncation should be applied
  const shouldTruncate = truncate || !!maxWidth;

  return (
    <div
      className={cn(
        // Layout
        "inline-flex items-center justify-center",
        // Spacing
        "px-2 py-[3px] gap-1.5",
        // Minimum dimensions
        "min-h-[24px]",
        // Background and border
        "bg-white/10 border border-solid border-slate-300",
        // Border radius
        "rounded-lg",
        // Shadow
        "shadow-sm",
        // Shrink behavior - allow shrinking when truncate is enabled
        shouldTruncate ? "min-w-0 flex-shrink" : "shrink-0",
        className
      )}
      style={chipStyle}
      {...props}
    >
      <span
        className={cn(
          // Typography
          "font-sans font-semibold",
          "text-xs leading-4",
          // Text styling
          "text-slate-950",
          "tracking-[0.18px] text-center",
          // Truncation support
          shouldTruncate ? "truncate" : "whitespace-nowrap"
        )}
        title={shouldTruncate ? label : undefined}
      >
        {label}
      </span>
    </div>
  );
}

export default SourceChip;
