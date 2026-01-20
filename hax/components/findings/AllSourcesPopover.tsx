"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { SourceChip } from "./SourceChip";

export interface AllSourcesPopoverProps {
  /** All source labels to display in the popover */
  sources: string[];
  /** The trigger element (typically the +N chip) */
  children: React.ReactNode;
  /** Callback when a source chip is clicked */
  onSourceClick?: (source: string, index: number) => void;
  /** Whether the popover is open (controlled mode) */
  open?: boolean;
  /** Callback when open state changes (controlled mode) */
  onOpenChange?: (open: boolean) => void;
}

/**
 * AllSourcesPopover - A popover component that displays all source citations
 *
 * Based on Figma design (node 655:4736):
 * - Dialog with white background and border
 * - Header with "All Sources" title
 * - Vertical list of source chips
 * - Cancel button at the footer
 *
 * Uses Figma design system variables:
 * - Background: general/background (white)
 * - Border: general/border (#e2e8f0)
 * - Border radius: semantic/rounded-xl (12px)
 * - Shadow: lg shadow
 */
export function AllSourcesPopover({
  sources,
  children,
  onSourceClick,
  open,
  onOpenChange,
}: AllSourcesPopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  // Support both controlled and uncontrolled modes
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className={cn(
          // Reset default styles
          "w-auto p-0",
          // Background and border
          "bg-white border border-solid border-slate-200",
          // Border radius
          "rounded-xl",
          // Shadow
          "shadow-lg"
        )}
        align="start"
        sideOffset={8}
      >
        <div className="flex flex-col min-w-[200px] max-w-[320px]">
          {/* Dialog Header */}
          <div className="flex flex-col items-start justify-between p-4">
            <div className="flex items-center gap-2 w-full">
              <h4
                className={cn(
                  // Typography
                  "font-sans font-semibold",
                  "text-xl leading-6",
                  // Color
                  "text-slate-950"
                )}
              >
                All Sources
              </h4>
            </div>
          </div>

          {/* Vertical Chips Container */}
          <div
            className={cn(
              "flex flex-col items-start justify-center",
              "gap-2 p-4 pt-0",
              "overflow-y-auto max-h-[240px]"
            )}
          >
            {sources.map((source, index) => (
              <SourceChip
                key={`${source}-${index}`}
                label={source}
                className={cn(
                  "cursor-pointer hover:bg-slate-100",
                  "transition-colors"
                )}
                onClick={() => onSourceClick?.(source, index)}
              />
            ))}
          </div>

          {/* Dialog Footer */}
          <div className="flex flex-col items-start p-4 pt-0">
            <div className="flex items-start justify-end w-full">
              <Button
                variant="default"
                size="default"
                onClick={handleClose}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AllSourcesPopover;
