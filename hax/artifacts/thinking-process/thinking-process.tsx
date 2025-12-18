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
import {
  CheckCircle,
  Circle,
  Loader2,
  XCircle,
  Brain,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

// ============================================================================
// ProcessStep Component
// ============================================================================

export type ProcessStepStatus = "completed" | "in-progress" | "pending" | "error"

export interface ProcessStepProps {
  /** Title of the process step */
  title: string
  /** Optional description/details of the step */
  description?: string
  /** Status of the step */
  status?: ProcessStepStatus
  /** Whether to show the icon */
  showIcon?: boolean
  /** Position icon on the right side instead of left */
  flipIcon?: boolean
  /** Additional class names */
  className?: string
}

export function ProcessStep({
  title,
  description,
  status = "pending",
  showIcon = true,
  flipIcon = false,
  className,
}: ProcessStepProps) {
  const isPending = status === "pending"
  const isError = status === "error"
  const isCompleted = status === "completed"
  const isInProgress = status === "in-progress"

  const renderIcon = () => {
    if (!showIcon) return null
    return (
      <div className="flex items-center pt-[3px] shrink-0">
        {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-600" />}
        {isInProgress && (
          <Loader2 className="w-4 h-4 text-slate-700 animate-spin" />
        )}
        {isPending && <Circle className="w-4 h-4 text-slate-400" />}
        {isError && <XCircle className="w-4 h-4 text-red-500" />}
      </div>
    )
  }

  return (
    <div
      className={cn("flex gap-4 items-center p-2 rounded-lg w-full", className)}
    >
      <div className="flex flex-1 gap-3 items-start min-w-0">
        {!flipIcon && renderIcon()}
        <div className="flex flex-1 flex-col gap-px min-w-0">
          <p
            className={cn(
              "font-sans font-semibold text-sm leading-[21px] tracking-[0.07px]",
              isPending && "text-[#64748b]",
              isError && "text-red-500",
              !isPending && !isError && "text-[#020617]",
            )}
          >
            {title}
          </p>
          {description && (
            <p
              className={cn(
                "font-sans font-normal text-sm leading-[21px] tracking-[0.07px]",
                isError ? "text-red-400" : "text-[#64748b]",
              )}
            >
              {description}
            </p>
          )}
        </div>
        {flipIcon && renderIcon()}
      </div>
    </div>
  )
}

// ============================================================================
// ConfidenceChip Component
// ============================================================================

export type ConfidenceChipVariant = "default" | "badge"

export interface ConfidenceChipProps {
  /** Label text (e.g., "Steps Completed") */
  label?: string
  /** Badge/value text (e.g., "2/5" or "Label") */
  value: string
  /** Variant style */
  variant?: ConfidenceChipVariant
  /** Additional class names */
  className?: string
}

export function ConfidenceChip({
  label = "Steps Completed",
  value,
  variant = "badge",
  className,
}: ConfidenceChipProps) {
  if (variant === "default") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-3 gap-1",
          "border border-dashed border-[#e2e8f0] rounded-lg",
          className,
        )}
      >
        <span className="font-sans font-normal text-sm leading-[21px] tracking-[0.07px] text-[#020617]">
          {label}
        </span>
        <span className="font-sans font-semibold text-sm leading-[21px] tracking-[0.07px] text-[#64748b]">
          {value}
        </span>
      </div>
    )
  }

  return (
    <div className={cn("flex gap-4 items-center justify-center", className)}>
      <span className="font-sans font-normal text-sm leading-[21px] tracking-[0.07px] text-[#020617]">
        {label}
      </span>
      <div
        className={cn(
          "flex items-center justify-center px-2 py-[3px] min-h-[24px]",
          "bg-[#d1fae5] rounded-lg",
        )}
      >
        <span className="font-sans font-semibold text-xs leading-4 tracking-[0.18px] text-[#059669]">
          {value}
        </span>
      </div>
    </div>
  )
}

// ============================================================================
// ReasoningStep Type
// ============================================================================

export interface ReasoningStep {
  /** Unique ID for the step */
  id: string
  /** Title of the step */
  title: string
  /** Description/details of the step */
  description?: string
  /** Status of the step */
  status: ProcessStepStatus
}

// ============================================================================
// AgentReasoning Component
// ============================================================================

export interface AgentReasoningProps {
  /** Title for the reasoning section */
  title?: string
  /** Array of reasoning steps */
  steps: ReasoningStep[]
  /** Whether the section is expanded */
  expanded?: boolean
  /** Callback when expanded state changes */
  onExpandedChange?: (expanded: boolean) => void
  /** Whether to show the expand/collapse control */
  collapsible?: boolean
  /** Additional class names */
  className?: string
}

export function AgentReasoning({
  title = "Agent Reasoning",
  steps,
  expanded = true,
  onExpandedChange,
  collapsible = true,
  className,
}: AgentReasoningProps) {
  const [isExpanded, setIsExpanded] = React.useState(expanded)

  const actualExpanded = onExpandedChange ? expanded : isExpanded
  const handleToggle = () => {
    if (onExpandedChange) {
      onExpandedChange(!actualExpanded)
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 items-start p-4 w-full",
        "bg-[#f5f3ff] border border-[#ddd6fe] rounded-lg",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center w-full",
          collapsible && "cursor-pointer",
        )}
        onClick={collapsible ? handleToggle : undefined}
      >
        <div className="flex gap-3 items-center">
          {collapsible && (
            <div className="flex items-center justify-center min-h-[18px] min-w-[18px] p-[3px] rounded-sm">
              {actualExpanded ? (
                <ChevronDown className="w-3 h-3 text-[#7c3aed]" />
              ) : (
                <ChevronRight className="w-3 h-3 text-[#7c3aed]" />
              )}
            </div>
          )}
          {!collapsible && (
            <div className="flex items-center justify-center min-h-[18px] min-w-[18px] p-[3px] rounded-sm">
              <Brain className="w-[10px] h-[10px] text-[#7c3aed]" />
            </div>
          )}
          <p className="font-sans font-semibold text-base leading-[22px] text-[#7c3aed]">
            {title}
          </p>
        </div>
      </div>

      {actualExpanded && (
        <div className="w-full h-px">
          <div className="w-full h-px bg-[#ddd6fe]" />
        </div>
      )}

      {actualExpanded && (
        <div className="flex flex-col gap-[2px] items-start w-full">
          {steps.map((step) => (
            <ProcessStep
              key={step.id}
              title={step.title}
              description={step.description}
              status={step.status}
              showIcon={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// StepMetric Type
// ============================================================================

export interface StepMetric {
  /** Label for the metric (e.g., "Steps Completed") */
  label: string
  /** Value/badge text (e.g., "2/5") */
  value: string
}

// ============================================================================
// ThinkingProcess Component
// ============================================================================

export interface ThinkingProcessProps {
  /** Title for the card */
  title?: string
  /** Badge text shown next to title (e.g., "HAX 04") */
  badge?: string
  /** Reasoning steps to display */
  steps: ReasoningStep[]
  /** Step metrics to display (e.g., completion status) */
  metrics?: StepMetric[]
  /** Whether to show the reasoning process toggle */
  showToggle?: boolean
  /** Label for the toggle */
  toggleLabel?: string
  /** Whether reasoning is visible (controlled) */
  showReasoning?: boolean
  /** Callback when toggle changes */
  onToggleReasoning?: (show: boolean) => void
  /** Whether the Agent Reasoning section is collapsible */
  reasoningCollapsible?: boolean
  /** Additional class names */
  className?: string
}

export function ThinkingProcess({
  title = "Thinking Process",
  badge,
  steps,
  metrics = [],
  showToggle = false,
  toggleLabel = "Show reasoning process",
  showReasoning = true,
  onToggleReasoning,
  reasoningCollapsible = true,
  className,
}: ThinkingProcessProps) {
  const [internalShowReasoning, setInternalShowReasoning] =
    React.useState(showReasoning)

  const actualShowReasoning = onToggleReasoning
    ? showReasoning
    : internalShowReasoning
  const handleToggle = () => {
    if (onToggleReasoning) {
      onToggleReasoning(!actualShowReasoning)
    } else {
      setInternalShowReasoning(!internalShowReasoning)
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 items-start p-6 w-full",
        "bg-white border border-[#e2e8f0] rounded-lg",
        "shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-col items-start p-4 w-full">
        <div className="flex items-center justify-between w-full">
          <h4 className="font-sans font-semibold text-xl leading-6 text-[#020617]">
            {title}
          </h4>
          {badge && (
            <div className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center px-3 py-[5.5px] min-h-[32px]",
                  "bg-[#dbeafe] rounded-lg",
                  "shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]",
                )}
              >
                <span className="font-sans font-semibold text-sm leading-[21px] tracking-[0.07px] text-[#3b82f6]">
                  {badge}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Agent Reasoning Section */}
      {actualShowReasoning && (
        <AgentReasoning steps={steps} collapsible={reasoningCollapsible} />
      )}

      {/* Step Metrics */}
      {metrics.length > 0 && (
        <div className="flex gap-8 items-center p-4 rounded-lg w-full">
          {metrics.map((metric, index) => (
            <ConfidenceChip
              key={index}
              label={metric.label}
              value={metric.value}
              variant="badge"
            />
          ))}
        </div>
      )}

      {/* Toggle */}
      {showToggle && (
        <div className="flex gap-2 items-start px-3 py-2 rounded-lg w-full">
          <div className="flex flex-1 flex-col items-start min-w-0">
            <p className="font-sans font-normal text-sm leading-[21px] tracking-[0.07px] text-[#334155]">
              {toggleLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggle}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full",
              "border-2 border-transparent shadow-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              actualShowReasoning ? "bg-[#7c3aed]" : "bg-[#e2e8f0]",
            )}
          >
            <span
              className={cn(
                "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform",
                actualShowReasoning ? "translate-x-4" : "translate-x-0",
              )}
            />
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// HAX Wrapper Component
// ============================================================================

interface HAXThinkingProcessProps {
  title?: string
  badge?: string
  steps: ReasoningStep[]
  metrics?: StepMetric[]
  showToggle?: boolean
  reasoningCollapsible?: boolean
}

export function HAXThinkingProcess({
  title,
  badge,
  steps,
  metrics,
  showToggle,
  reasoningCollapsible,
}: HAXThinkingProcessProps) {
  return (
    <div className="m-4">
      <ThinkingProcess
        title={title}
        badge={badge}
        steps={steps}
        metrics={metrics}
        showToggle={showToggle}
        reasoningCollapsible={reasoningCollapsible}
      />
    </div>
  )
}

export default ThinkingProcess
