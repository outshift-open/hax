/*
 * Copyright 2025 Cisco Systems, Inc. and its affiliates
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ============================================================================
// Types
// ============================================================================

export interface Finding {
  id: string;
  title: string;
  description: string;
  sources?: Array<{
    label: string;
    href?: string;
  }>;
}

export interface FindingsPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  findings: Finding[];
  sourcesLabel?: string;
  maxVisibleSources?: number;
  onSourceClick?: (source: string, index: number, findingId: string) => void;
}

// ============================================================================
// SourceChip Component
// ============================================================================

export interface SourceChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  maxWidth?: number | string;
  isCountChip?: boolean;
  truncate?: boolean;
}

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
    ...(maxWidth
      ? { maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth }
      : {}),
  };

  const shouldTruncate = truncate || !!maxWidth;

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center",
        "px-2 py-[3px] gap-1.5",
        "min-h-[24px]",
        "bg-white/10 border border-solid border-[#cbd5e1]",
        "rounded-lg",
        "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
        shouldTruncate ? "min-w-0 flex-shrink" : "shrink-0",
        className
      )}
      style={chipStyle}
      {...props}
    >
      <span
        className={cn(
          "font-sans font-semibold text-xs leading-4",
          "text-[#020617]",
          "tracking-[0.18px] text-center",
          shouldTruncate ? "truncate" : "whitespace-nowrap"
        )}
        title={shouldTruncate ? label : undefined}
      >
        {label}
      </span>
    </div>
  );
}

// ============================================================================
// AllSourcesPopover Component
// ============================================================================

export interface AllSourcesPopoverProps {
  sources: string[];
  children: React.ReactNode;
  onSourceClick?: (source: string, index: number) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AllSourcesPopover({
  sources,
  children,
  onSourceClick,
  open,
  onOpenChange,
}: AllSourcesPopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-white border border-solid border-[#e2e8f0] rounded-xl shadow-lg"
        align="start"
        sideOffset={8}
      >
        <div className="flex flex-col min-w-[200px] max-w-[320px]">
          {/* Dialog Header */}
          <div className="flex flex-col items-start justify-between p-4">
            <div className="flex items-center gap-2 w-full">
              <h4 className="font-sans font-semibold text-xl leading-6 text-[#020617]">
                All Sources
              </h4>
            </div>
          </div>

          {/* Vertical Chips Container */}
          <div className="flex flex-col items-start justify-center gap-2 p-4 pt-0 overflow-y-auto max-h-[240px]">
            {sources.map((source, index) => (
              <SourceChip
                key={`${source}-${index}`}
                label={source}
                className="cursor-pointer hover:bg-[#f1f5f9] transition-colors"
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

// ============================================================================
// SourceChips Component
// ============================================================================

export interface SourceChipsProps extends React.HTMLAttributes<HTMLDivElement> {
  sources: string[];
  label?: string;
  maxVisible?: number;
  maxChipWidth?: number | string;
  onSourceClick?: (source: string, index: number) => void;
}

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

  const totalChips = sources.length;
  const effectiveMaxVisible =
    maxVisible !== undefined
      ? Math.max(totalChips >= 2 ? 2 : 1, maxVisible)
      : totalChips;

  const visibleSources = sources.slice(0, effectiveMaxVisible);
  const overflowCount = totalChips - effectiveMaxVisible;
  const hasOverflow = overflowCount > 0;

  return (
    <div
      className={cn("flex items-center gap-4", "w-full min-w-0", className)}
      {...props}
    >
      {/* Label */}
      <p className="font-sans font-normal text-xs leading-4 text-[#64748b] tracking-[0.18px] whitespace-nowrap shrink-0">
        {label}
      </p>

      {/* Chips container */}
      <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
        {visibleSources.map((source, index) => (
          <SourceChip
            key={`${source}-${index}`}
            label={source}
            maxWidth={maxChipWidth}
            truncate
          />
        ))}

        {/* Overflow indicator chip */}
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
                className="cursor-pointer hover:bg-[#f1f5f9] transition-colors"
              />
            </button>
          </AllSourcesPopover>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// FindingsCard Component
// ============================================================================

export interface FindingsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  sources?: string[];
  showSources?: boolean;
  sourcesLabel?: string;
  maxVisibleSources?: number;
  onSourceClick?: (source: string, index: number) => void;
}

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
        "flex flex-col items-start justify-center",
        "p-4 gap-4",
        "bg-white border border-solid border-[#e2e8f0]",
        "rounded-lg",
        "w-full max-w-[400px] overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Content section */}
      <div className="flex gap-3 items-start w-full shrink-0">
        {/* Text content */}
        <div className="flex flex-col gap-px items-start text-sm leading-[21px] tracking-[0.07px] grow basis-0 min-w-[1px] min-h-[1px]">
          {/* Title */}
          <p className="font-sans font-semibold text-[#020617] w-full shrink-0">
            {title}
          </p>

          {/* Description */}
          <p className="font-sans font-normal text-[#64748b] w-full shrink-0">
            {description}
          </p>
        </div>
      </div>

      {/* Sources section */}
      {showSources && sources.length > 0 && (
        <SourceChips
          sources={sources}
          label={sourcesLabel}
          maxVisible={maxVisibleSources ?? 2}
          onSourceClick={onSourceClick}
        sourcesLabel={sourcesLabel}
        maxVisibleSources={maxVisibleSources}
        />
      )}
    </div>
  );
}

// ============================================================================
// FindingsPanel Component (Main Export)
// ============================================================================

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
  const sourceLabels = sources?.map((s) => s.label) || [];

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
        "flex flex-col items-start",
        "p-6 gap-2",
        "bg-white border border-solid border-[#e2e8f0]",
        "rounded-lg",
        "shadow-sm",
        "w-full",
        className
      )}
      {...props}
    >
      {/* Panel Header */}
      <div className="flex flex-col items-start gap-1 w-full shrink-0">
        <p className="font-sans font-semibold text-base leading-6 text-[#020617] w-full">
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
        sourcesLabel={sourcesLabel}
        maxVisibleSources={maxVisibleSources}
        />
      ))}
    </div>
  );
}

// ============================================================================
// HAX Wrapper (Default Export for HAX SDK)
// ============================================================================

export interface HAXFindingsProps {
  sourcesLabel?: string;
  maxVisibleSources?: number;
  title: string;
  findings: Finding[];
  onSourceClick?: (source: string, index: number, findingId: string) => void;
}

export function HAXFindings({
  sourcesLabel,
  maxVisibleSources,
  title,
  findings,
  onSourceClick,
}: HAXFindingsProps) {
  return (
    <div className="mx-auto w-full max-w-2xl p-4">
      <FindingsPanel
        title={title}
        findings={findings}
        onSourceClick={onSourceClick}
        sourcesLabel={sourcesLabel}
        maxVisibleSources={maxVisibleSources}
      />
    </div>
  );
}

export default HAXFindings;
