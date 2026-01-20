"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SourceChip } from "./SourceChip";
import { AllSourcesPopover } from "./AllSourcesPopover";

export interface SourceChipsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of source labels to display as chips */
  sources: string[];
  /** Label shown before the chips (default: "Sources:") */
  label?: string;
  /**
   * Maximum number of chips to show before collapsing into "+N"
   * - If not set, all chips are shown
   * - Minimum visible is 2 when sources.length >= 2
   */
  maxVisible?: number;
  /**
   * Maximum width for individual chips (truncates with ellipsis)
   * - Only applies when there's a single chip
   * - When there are 2+ chips, they show fully (no truncation on individual chips)
   */
  maxChipWidth?: number | string;
  /** Callback when a source chip is clicked in the popover */
  onSourceClick?: (source: string, index: number) => void;
}

/**
 * SourceChips - A container component that displays a list of source chips
 *
 * Uses Figma design system variables:
 * - Label typography: paragraph/mini (12px, regular)
 * - Label color: general/muted-foreground (#64748b)
 * - Gap between label and chips: 16px
 * - Gap between chips: semantic/xs (8px)
 *
 * Features:
 * - Single line layout: Chips are always displayed on one line
 * - Overflow handling: Shows "+N" chip when chips exceed maxVisible
 * - Truncation: Single long chip can be truncated with maxChipWidth
 * - Always shows at least 2 chips fully when sources.length >= 2
 */
export function SourceChips({
  sources,
  label = "Sources:",
  maxVisible,
  maxChipWidth,
  onSourceClick,
  className,
  ...props
}: SourceChipsProps) {
  if (!sources || sources.length === 0) {
    return null;
  }

  // Calculate visible chips and overflow count
  const totalChips = sources.length;

  // Ensure we show at least 2 chips when there are 2+ sources
  const effectiveMaxVisible = maxVisible !== undefined
    ? Math.max(totalChips >= 2 ? 2 : 1, maxVisible)
    : totalChips;

  const visibleSources = sources.slice(0, effectiveMaxVisible);
  const overflowCount = totalChips - effectiveMaxVisible;
  const hasOverflow = overflowCount > 0;

  return (
    <div
      className={cn(
        // Layout
        "flex items-center gap-4",
        // Full width and overflow handling
        "w-full min-w-0",
        className
      )}
      {...props}
    >
      {/* Label */}
      <p
        className={cn(
          // Typography
          "font-sans font-normal",
          "text-xs leading-4",
          // Text styling
          "text-slate-500",
          "tracking-[0.18px] whitespace-nowrap shrink-0"
        )}
      >
        {label}
      </p>

      {/* Chips container */}
      <div
        className={cn(
          // Layout - single line, no wrap
          "flex items-center",
          // Gap
          "gap-2",
          // Allow container to shrink and handle overflow
          "min-w-0 flex-1 overflow-hidden"
        )}
      >
        {visibleSources.map((source, index) => (
          <SourceChip
            key={`${source}-${index}`}
            label={source}
            maxWidth={maxChipWidth}
            truncate
          />
        ))}

        {/* Overflow indicator chip - clickable to show all sources */}
        {hasOverflow && (
          <AllSourcesPopover sources={sources} onSourceClick={onSourceClick}>
            <button
              type="button"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-lg"
              aria-label={`Show all ${totalChips} sources`}
            >
              <SourceChip
                label={`+${overflowCount}`}
                isCountChip
                title={`${overflowCount} more source${overflowCount > 1 ? "s" : ""}`}
                className="cursor-pointer hover:bg-slate-100 transition-colors"
              />
            </button>
          </AllSourcesPopover>
        )}
      </div>
    </div>
  );
}

export default SourceChips;
