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
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export type ConfidenceLevel = "high" | "medium" | "low"

const confidenceLevelConfig: Record<
  ConfidenceLevel,
  { label: string; color: string }
> = {
  high: { label: "High", color: "#2ca02c" },
  medium: { label: "Medium", color: "#ff7f0e" },
  low: { label: "Low", color: "#facc15" },
}

export interface ConfidenceValueProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  level: ConfidenceLevel
}

export function ConfidenceValue({
  value,
  level,
  className,
  ...props
}: ConfidenceValueProps) {
  const { label, color } = confidenceLevelConfig[level]

  return (
    <div
      className={cn("flex items-center flex-1 min-w-0", className)}
      {...props}
    >
      <div
        className={cn(
          "text-sm font-normal leading-[21px] tracking-[0.07px]",
          "text-[#020617] w-[63px] shrink-0",
        )}
      >
        <p>{label}</p>
        <p>({value}%)</p>
      </div>
      <Progress
        value={value}
        indicatorColor={color}
        className="flex-1 grow h-2 min-w-0"
      />
    </div>
  )
}

export interface DiagnosticTableHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  showSuspectedCause?: boolean
  showConfidence?: boolean
  showRationale?: boolean
  showRecommendedAction?: boolean
}

export function DiagnosticTableHeader({
  showSuspectedCause = true,
  showConfidence = true,
  showRationale = true,
  showRecommendedAction = true,
  className,
  ...props
}: DiagnosticTableHeaderProps) {
  const headerCellClass = cn(
    "flex-1 min-w-0 flex items-center gap-2",
    "bg-[#f8fafc] px-2 py-[7.5px]",
    "text-sm font-semibold leading-[21px] tracking-[0.07px]",
    "text-[#020617] whitespace-nowrap",
  )

  return (
    <div
      className={cn("flex items-center gap-5 px-4 py-0 w-full", className)}
      {...props}
    >
      {showSuspectedCause && (
        <div className={headerCellClass}>Suspected Cause</div>
      )}
      {showConfidence && <div className={headerCellClass}>Confidence</div>}
      {showRationale && <div className={headerCellClass}>Rationale</div>}
      {showRecommendedAction && (
        <div className={headerCellClass}>Recommended Action</div>
      )}
    </div>
  )
}

export interface DiagnosticValueCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  suspectedCause: string
  confidence: number
  confidenceLevel: ConfidenceLevel
  rationale: string
  recommendedAction: string
  onActionClick?: () => void
}

export function DiagnosticValueCard({
  suspectedCause,
  confidence,
  confidenceLevel,
  rationale,
  recommendedAction,
  onActionClick,
  className,
  ...props
}: DiagnosticValueCardProps) {
  const cellClass = cn(
    "flex-1 min-w-0 flex items-center gap-2",
    "px-2 py-[7.5px]",
    "text-sm font-normal leading-[21px] tracking-[0.07px]",
    "text-[#020617]",
  )

  return (
    <div
      className={cn(
        "flex items-center gap-5 px-4 py-5 w-full",
        "border border-solid border-[#e2e8f0] rounded-lg",
        className,
      )}
      {...props}
    >
      <div className={cellClass}>
        <p className="flex-1 min-w-0">{suspectedCause}</p>
      </div>

      <ConfidenceValue
        value={confidence}
        level={confidenceLevel}
        className="flex-1 min-w-0"
      />

      <div className={cellClass}>
        <p className="flex-1 min-w-0">{rationale}</p>
      </div>

      <div className="flex-1 min-w-0 flex items-center justify-center">
        <Button
          variant="outline"
          onClick={onActionClick}
          className={cn(
            "h-9 px-4 py-[7.5px] min-h-[36px] flex-1",
            "bg-white/10 border-[#cbd5e1]",
            "text-sm font-semibold leading-[21px] tracking-[0.07px] text-[#020617]",
            "shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]",
            "rounded-lg",
          )}
        >
          {recommendedAction}
        </Button>
      </div>
    </div>
  )
}

export interface DiagnosticItem {
  id: string
  suspectedCause: string
  confidence: number
  confidenceLevel: ConfidenceLevel
  rationale: string
  recommendedAction: string
}

export interface DiagnosticReportCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  items: DiagnosticItem[]
  onActionClick?: (itemId: string) => void
}

export function DiagnosticReportCard({
  title = "Diagnostic Report With Actionables",
  items,
  onActionClick,
  className,
  ...props
}: DiagnosticReportCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-solid border-[#e2e8f0]",
        "rounded-lg px-6 py-6 w-full",
        "shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]",
        className,
      )}
      {...props}
    >
      <div className="pb-6">
        <p className="text-base font-semibold leading-6 text-[#171717]">
          {title}
        </p>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <DiagnosticTableHeader />

        <div className="flex flex-col gap-4 w-full">
          {items.map((item) => (
            <DiagnosticValueCard
              key={item.id}
              suspectedCause={item.suspectedCause}
              confidence={item.confidence}
              confidenceLevel={item.confidenceLevel}
              rationale={item.rationale}
              recommendedAction={item.recommendedAction}
              onActionClick={() => onActionClick?.(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface HAXDiagnosticReportProps {
  title?: string
  items: DiagnosticItem[]
  onActionClick?: (itemId: string) => void
}

export function HAXDiagnosticReport({
  title,
  items,
  onActionClick,
}: HAXDiagnosticReportProps) {
  return (
    <div className="m-4">
      <DiagnosticReportCard
        title={title}
        items={items}
        onActionClick={onActionClick}
      />
    </div>
  )
}

export default DiagnosticReportCard
