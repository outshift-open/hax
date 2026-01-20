"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { FindingsCard } from "./FindingsCard";

export interface Finding {
  /** Unique identifier for the finding */
  id: string;
  /** Title of the finding */
  title: string;
  /** Description/recommendation about the finding */
  description: string;
  /** Array of source labels with optional links */
  sources?: Array<{
    label: string;
    href?: string;
  }>;
}

export interface FindingsPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Header title for the panel */
  title: string;
  /** Array of findings to display */
  findings: Finding[];
  /** Custom sources label (default: "Sources:") */
  sourcesLabel?: string;
  /** Maximum number of source chips to show before collapsing into "+N" */
  maxVisibleSources?: number;
  /** Callback when a source chip is clicked in the popover */
  onSourceClick?: (source: string, index: number, findingId: string) => void;
}

/**
 * FindingsPanel - A container component for displaying multiple findings
 *
 * Uses Figma design system variables:
 * - Background: card/card (#ffffff)
 * - Border: general/border (#e2e8f0)
 * - Border radius: semantic/rounded-lg (8px)
 * - Padding: 24px (panel padding)
 * - Gap between items: semantic/xs (8px)
 * - Shadow: sm shadow
 * - Header: paragraph/regular bold (16px, semibold, neutral-500)
 */
export function FindingsPanel({
  title,
  findings,
  sourcesLabel,
  maxVisibleSources,
  onSourceClick,
  className,
  ...props
}: FindingsPanelProps) {
  return (
    <div
      className={cn(
        // Layout
        "flex flex-col items-start",
        // Spacing
        "p-6 gap-2",
        // Background and border
        "bg-white border border-solid border-slate-200",
        // Border radius
        "rounded-lg",
        // Shadow
        "shadow-sm",
        // Full width
        "w-full",
        className
      )}
      {...props}
    >
      {/* Panel Header */}
      <div
        className={cn(
          // Layout
          "flex flex-col items-start gap-1",
          // Full width
          "w-full shrink-0"
        )}
      >
        <p
          className={cn(
            // Typography
            "font-sans font-semibold",
            "text-base leading-6",
            // Color - neutral/500 for header
            "text-neutral-500",
            // Full width
            "w-full"
          )}
        >
          {title}
        </p>
      </div>

      {/* Findings List */}
      {findings.map((finding) => (
        <FindingsPanelItem
          key={finding.id}
          findingId={finding.id}
          title={finding.title}
          description={finding.description}
          sources={finding.sources}
          sourcesLabel={sourcesLabel}
          maxVisibleSources={maxVisibleSources}
          onSourceClick={onSourceClick}
        />
      ))}
    </div>
  );
}

/**
 * FindingsPanelItem - Individual finding item within the panel
 * This is an internal component that wraps FindingsCard with panel-specific styling
 */
interface FindingsPanelItemProps {
  findingId: string;
  title: string;
  description: string;
  sources?: Array<{
    label: string;
    href?: string;
  }>;
  sourcesLabel?: string;
  maxVisibleSources?: number;
  onSourceClick?: (source: string, index: number, findingId: string) => void;
}

function FindingsPanelItem({
  findingId,
  title,
  description,
  sources,
  sourcesLabel,
  maxVisibleSources,
  onSourceClick,
}: FindingsPanelItemProps) {
  // Convert sources with links to simple strings for FindingsCard
  // The SourceChip component can be enhanced later to support links
  const sourceLabels = sources?.map((s) => s.label) || [];

  // Wrap the onSourceClick to include findingId
  const handleSourceClick = onSourceClick
    ? (source: string, index: number) => onSourceClick(source, index, findingId)
    : undefined;

  return (
    <FindingsCard
      title={title}
      description={description}
      sources={sourceLabels}
      sourcesLabel={sourcesLabel}
      showSources={sourceLabels.length > 0}
      maxVisibleSources={maxVisibleSources}
      onSourceClick={handleSourceClick}
      className="w-full max-w-none"
    />
  );
}

export default FindingsPanel;
