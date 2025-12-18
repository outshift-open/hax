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

"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// ============================================================================
// SourceChip Component
// ============================================================================

export interface SourceChipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The text label to display in the chip */
  label: string
  /** Maximum width for the chip - text will truncate with ellipsis if exceeded */
  maxWidth?: number | string
  /** Whether this is a count chip (e.g., "+3") - uses slightly different styling */
  isCountChip?: boolean
  /** Whether to allow the chip to shrink and truncate text when container is constrained */
  truncate?: boolean
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
  }

  const shouldTruncate = truncate || !!maxWidth

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
        className,
      )}
      style={chipStyle}
      {...props}
    >
      <span
        className={cn(
          "font-sans font-semibold",
          "text-xs leading-4",
          "text-[#020617]",
          "tracking-[0.18px] text-center",
          shouldTruncate ? "truncate" : "whitespace-nowrap",
        )}
        title={shouldTruncate ? label : undefined}
      >
        {label}
      </span>
    </div>
  )
}

// ============================================================================
// SourceChips Component
// ============================================================================

export interface SourceChipsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of source labels to display as chips */
  sources: string[]
  /** Label shown before the chips (default: "Sources:") */
  label?: string
  /** Maximum number of chips to show before collapsing into "+N" */
  maxVisible?: number
  /** Maximum width for individual chips (truncates with ellipsis) */
  maxChipWidth?: number | string
}

export function SourceChips({
  sources,
  label = "Sources:",
  maxVisible,
  maxChipWidth,
  className,
  ...props
}: SourceChipsProps) {
  if (!sources || sources.length === 0) {
    return null
  }

  const totalChips = sources.length
  const effectiveMaxVisible =
    maxVisible !== undefined
      ? Math.max(totalChips >= 2 ? 2 : 1, maxVisible)
      : totalChips

  const visibleSources = sources.slice(0, effectiveMaxVisible)
  const overflowCount = totalChips - effectiveMaxVisible
  const hasOverflow = overflowCount > 0

  return (
    <div
      className={cn("flex items-center gap-4", "w-full min-w-0", className)}
      {...props}
    >
      <p
        className={cn(
          "font-sans font-normal",
          "text-xs leading-4",
          "text-[#64748b]",
          "tracking-[0.18px] whitespace-nowrap shrink-0",
        )}
      >
        {label}
      </p>

      <div
        className={cn(
          "flex items-center",
          "gap-2",
          "min-w-0 flex-1 overflow-hidden",
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

        {hasOverflow && (
          <SourceChip
            label={`+${overflowCount}`}
            isCountChip
            title={`${overflowCount} more source${overflowCount > 1 ? "s" : ""}`}
          />
        )}
      </div>
    </div>
  )
}

// ============================================================================
// FindingsCard Component
// ============================================================================

export interface FindingsCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Title text displayed in bold */
  title: string
  /** Description text displayed below the title */
  description: string
  /** Array of source labels to display as chips */
  sources?: string[]
  /** Whether to show the sources section */
  showSources?: boolean
  /** Custom sources label */
  sourcesLabel?: string
  /** Maximum number of chips to show before collapsing into "+N" */
  maxVisibleSources?: number
}

export function FindingsCard({
  title,
  description,
  sources = [],
  showSources = true,
  sourcesLabel,
  maxVisibleSources,
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
        className,
      )}
      {...props}
    >
      <div className={cn("flex gap-3 items-start", "w-full shrink-0")}>
        <div
          className={cn(
            "flex flex-col gap-px items-start",
            "text-sm leading-[21px]",
            "tracking-[0.07px]",
            "grow basis-0 min-w-[1px] min-h-[1px]",
          )}
        >
          <p
            className={cn(
              "font-sans font-semibold",
              "text-[#020617]",
              "w-full shrink-0",
            )}
          >
            {title}
          </p>

          <p
            className={cn(
              "font-sans font-normal",
              "text-[#64748b]",
              "w-full shrink-0",
            )}
          >
            {description}
          </p>
        </div>
      </div>

      {showSources && sources.length > 0 && (
        <SourceChips
          sources={sources}
          label={sourcesLabel}
          maxVisible={maxVisibleSources ?? 2}
        />
      )}
    </div>
  )
}

// ============================================================================
// Finding Type
// ============================================================================

export interface Finding {
  /** Unique identifier for the finding */
  id: string
  /** Title of the finding */
  title: string
  /** Description/recommendation about the finding */
  description: string
  /** Array of source labels with optional links */
  sources?: Array<{
    label: string
    href?: string
  }>
}

// ============================================================================
// FindingsPanel Component
// ============================================================================

export interface FindingsPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Header title for the panel */
  title: string
  /** Array of findings to display */
  findings: Finding[]
  /** Custom sources label (default: "Sources:") */
  sourcesLabel?: string
  /** Maximum number of source chips to show before collapsing into "+N" */
  maxVisibleSources?: number
}

export function FindingsPanel({
  title,
  findings,
  sourcesLabel,
  maxVisibleSources,
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
        "shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]",
        "w-full",
        className,
      )}
      {...props}
    >
      <div className={cn("flex flex-col items-start gap-1", "w-full shrink-0")}>
        <p
          className={cn(
            "font-sans font-semibold",
            "text-base leading-6",
            "text-[#737373]",
            "w-full",
          )}
        >
          {title}
        </p>
      </div>

      {findings.map((finding) => {
        const sourceLabels = finding.sources?.map((s) => s.label) || []
        return (
          <FindingsCard
            key={finding.id}
            title={finding.title}
            description={finding.description}
            sources={sourceLabels}
            sourcesLabel={sourcesLabel}
            showSources={sourceLabels.length > 0}
            maxVisibleSources={maxVisibleSources}
            className="w-full max-w-none"
          />
        )
      })}
    </div>
  )
}

// ============================================================================
// HAX Wrapper Component
// ============================================================================

interface HAXFindingsProps {
  title: string
  findings: Finding[]
  sourcesLabel?: string
  maxVisibleSources?: number
}

export function HAXFindings({
  title,
  findings,
  sourcesLabel,
  maxVisibleSources,
}: HAXFindingsProps) {
  return (
    <div className="m-4">
      <FindingsPanel
        title={title}
        findings={findings}
        sourcesLabel={sourcesLabel}
        maxVisibleSources={maxVisibleSources}
      />
    </div>
  )
}

export default FindingsPanel
