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
import type {
  Intent,
  ImpactLevel,
  ExploitabilityLevel,
  AssessmentSummary,
  RationaleItem,
  Metadata,
} from "./types"

// =============================================================================
// Component Props
// =============================================================================

export interface InlineRationaleProps {
  /** Unique identifier */
  id: string
  /** Assessment type - flexible string (e.g., "security_assessment", "code_review") */
  assessmentType: string
  /** Intent drives visual theme: warn=yellow, block=red, approve=green, inform=blue */
  intent: Intent
  /** Display title */
  title: string
  /** Main description paragraph */
  description: string
  /** Structured summary for badges (impact + exploitability) */
  summary: AssessmentSummary
  /** Detail items displayed as "Label: Value" pairs */
  rationale: RationaleItem[]
  /** Confidence score 0-100 (badge color derived from intent) */
  confidence: number
  /** Optional metadata */
  metadata?: Metadata
  /** Optional: collapsed state */
  collapsed?: boolean
  /** Optional: enable collapse toggle */
  collapsible?: boolean
  /** Optional: collapse change callback */
  onCollapseChange?: (collapsed: boolean) => void
  /** Optional: additional CSS classes */
  className?: string
}

// =============================================================================
// Internal Style Mappings
// =============================================================================

type VariantKey = "critical" | "warning" | "success" | "info"
type BadgeVariant = "default" | "success" | "warning" | "critical"

/** Intent → card variant (background/border) */
const INTENT_TO_VARIANT: Record<Intent, VariantKey> = {
  warn: "warning",
  approve: "success",
  block: "critical",
  inform: "info",
}

/** Intent → confidence badge color */
const INTENT_TO_BADGE_VARIANT: Record<Intent, BadgeVariant> = {
  warn: "warning",
  approve: "success",
  block: "critical",
  inform: "success",
}

/** Card variant styles */
const VARIANT_STYLES: Record<VariantKey, { background: string; border: string }> = {
  critical: {
    background: "bg-[#fff1f2]",
    border: "border-[#e11d48]",
  },
  warning: {
    background: "bg-[#fffbeb]",
    border: "border-[#f59e0b]",
  },
  success: {
    background: "bg-[#ecfdf5]",
    border: "border-[#059669]",
  },
  info: {
    background: "bg-[#eff6ff]",
    border: "border-[#3b82f6]",
  },
}

/** Badge variant styles */
const BADGE_STYLES: Record<BadgeVariant, string> = {
  default: "bg-[#f1f5f9] text-[#0f172a]",
  success: "bg-[#a7f3d0] text-[#047857]",
  warning: "bg-[#fde68a] text-[#b45309]",
  critical: "bg-[#fecaca] text-[#dc2626]",
}

/** Impact level labels */
const IMPACT_LABELS: Record<ImpactLevel, string> = {
  low: "Low Impact",
  medium: "Medium Impact",
  high: "High Impact",
  critical: "Critical Impact",
}

/** Exploitability level labels */
const EXPLOITABILITY_LABELS: Record<ExploitabilityLevel, string> = {
  none: "Exploitability : None",
  low: "Exploitability : Low",
  medium: "Exploitability : Medium",
  high: "Exploitability : High",
}

// =============================================================================
// Component
// =============================================================================

export function InlineRationale({
  id,
  assessmentType,
  intent,
  title,
  description,
  summary,
  rationale,
  confidence,
  collapsed = false,
  collapsible = false,
  onCollapseChange,
  className,
}: InlineRationaleProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed)

  React.useEffect(() => {
    setIsCollapsed(collapsed)
  }, [collapsed])

  const handleToggleCollapse = () => {
    if (collapsible) {
      const newState = !isCollapsed
      setIsCollapsed(newState)
      onCollapseChange?.(newState)
    }
  }

  // Get card variant from intent
  const variant = INTENT_TO_VARIANT[intent]
  const variantStyle = VARIANT_STYLES[variant]

  // Build badges: Impact (gray) → Exploitability (gray) → Confidence (colored) → Tags (gray)
  const badges = [
    { label: IMPACT_LABELS[summary.impact], variant: "default" as BadgeVariant },
    { label: EXPLOITABILITY_LABELS[summary.exploitability], variant: "default" as BadgeVariant },
    { label: `${confidence}% Confidence`, variant: INTENT_TO_BADGE_VARIANT[intent] },
    ...(summary.tags?.map(tag => ({ label: tag, variant: "default" as BadgeVariant })) || []),
  ]

  return (
    <div
      id={id}
      data-type={assessmentType}
      data-intent={intent}
      className={cn(
        "border border-solid rounded-lg p-4 w-full",
        "flex flex-col gap-4",
        variantStyle.background,
        variantStyle.border,
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between gap-4 min-h-[24px]",
          collapsible && "cursor-pointer"
        )}
        onClick={handleToggleCollapse}
      >
        {/* Title */}
        <h4 className="font-semibold text-xl leading-6 text-[#020617] tracking-[0px] shrink-0">
          {title}
        </h4>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-[10px] items-center justify-end">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={cn(
                  "inline-flex items-center justify-center",
                  "min-h-[24px] px-2 py-[3px] rounded-lg",
                  "text-xs font-semibold leading-4 tracking-[0.18px] whitespace-nowrap",
                  BADGE_STYLES[badge.variant]
                )}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}

        {/* Collapse indicator */}
        {collapsible && (
          <svg
            className={cn(
              "w-5 h-5 text-[#64748b] transition-transform shrink-0",
              isCollapsed ? "rotate-0" : "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>

      {/* Content (collapsible) */}
      {!isCollapsed && (
        <>
          {/* Separator - violet color as per Figma */}
          <div className="w-full h-px relative">
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "#ddd6fe" }}
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-[2px] w-full">
            <div className="flex gap-4 items-center p-2 rounded-lg w-full">
              <div className="flex-1 text-sm leading-[21px] tracking-[0.07px] text-[#020617]">
                {/* Main description */}
                {description && (
                  <p className="font-normal mb-[14px]">{description}</p>
                )}

                {/* Detail items */}
                {rationale.map((item, index) => (
                  <p key={index} className={cn(index < rationale.length - 1 && "mb-[14px]")}>
                    <span className="font-semibold">{item.label}:</span>
                    <span className="font-normal"> {item.value}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// =============================================================================
// HAX Wrapper Component
// =============================================================================

interface HAXInlineRationaleProps {
  assessmentType: string
  intent: Intent
  title: string
  description: string
  summary: AssessmentSummary
  rationale: RationaleItem[]
  confidence: number
  metadata?: Metadata
  collapsed?: boolean
  collapsible?: boolean
}

export function HAXInlineRationale({
  assessmentType,
  intent,
  title,
  description,
  summary,
  rationale,
  confidence,
  metadata,
  collapsed,
  collapsible,
}: HAXInlineRationaleProps) {
  return (
    <div className="m-4">
      <InlineRationale
        id={`inline-rationale-${Date.now()}`}
        assessmentType={assessmentType}
        intent={intent}
        title={title}
        description={description}
        summary={summary}
        rationale={rationale}
        confidence={confidence}
        metadata={metadata}
        collapsed={collapsed}
        collapsible={collapsible}
      />
    </div>
  )
}

export default InlineRationale
