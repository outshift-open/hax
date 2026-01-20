"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SourceChips } from "./SourceChips";

export interface FindingsCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Title text displayed in bold */
  title: string;
  /** Description text displayed below the title */
  description: string;
  /** Array of source labels to display as chips */
  sources?: string[];
  /** Whether to show the sources section */
  showSources?: boolean;
  /** Custom sources label */
  sourcesLabel?: string;
  /** Maximum number of chips to show before collapsing into "+N" */
  maxVisibleSources?: number;
  /** Callback when a source chip is clicked in the popover */
  onSourceClick?: (source: string, index: number) => void;
}

/**
 * FindingsCard - A card component for displaying findings with optional source chips
 *
 * Uses Figma design system variables:
 * - Background: card/card (#ffffff)
 * - Border: general/border (#e2e8f0)
 * - Border radius: semantic/rounded-lg (8px)
 * - Padding: semantic/md (16px)
 * - Gap: semantic/md (16px)
 * - Title: paragraph/small bold (14px, semibold)
 * - Description: paragraph/small regular (14px, regular)
 */
export function FindingsCard({
  title,
  description,
  sources = [],
  showSources = true,
  sourcesLabel,
  maxVisibleSources,
  onSourceClick,
  className,
  ...props
}: FindingsCardProps) {
  return (
    <div
      className={cn(
        // Layout
        "flex flex-col items-start justify-center",
        // Spacing
        "p-4 gap-4",
        // Background and border
        "bg-white border border-solid border-slate-200",
        // Border radius
        "rounded-lg",
        // Width and overflow
        "w-full max-w-[400px] overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Content section */}
      <div
        className={cn(
          // Layout
          "flex gap-3 items-start",
          // Full width
          "w-full shrink-0"
        )}
      >
        {/* Text content */}
        <div
          className={cn(
            // Layout
            "flex flex-col gap-px items-start",
            // Typography base
            "text-sm leading-[21px]",
            "tracking-[0.07px]",
            // Grow to fill
            "grow basis-0 min-w-[1px] min-h-[1px]"
          )}
        >
          {/* Title */}
          <p
            className={cn(
              // Typography
              "font-sans font-semibold",
              // Color
              "text-slate-950",
              // Full width
              "w-full shrink-0"
            )}
          >
            {title}
          </p>

          {/* Description */}
          <p
            className={cn(
              // Typography
              "font-sans font-normal",
              // Color
              "text-slate-500",
              // Full width
              "w-full shrink-0"
            )}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Sources section - single line with overflow */}
      {showSources && sources.length > 0 && (
        <SourceChips
          sources={sources}
          label={sourcesLabel}
          maxVisible={maxVisibleSources ?? 2}
          onSourceClick={onSourceClick}
        />
      )}
    </div>
  );
}

export default FindingsCard;
