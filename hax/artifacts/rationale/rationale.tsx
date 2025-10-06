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

import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export interface RationaleCriterion {
  label: string
  value: string
  description?: string
  sentiment?: "positive" | "negative" | "neutral"
}

export interface InlineRationaleProps extends React.ComponentProps<"div"> {
  decision: string
  criteria?: RationaleCriterion[]
  reasoning: string
  confidence?: number
  confidenceDescription?: string
  variant?: "priority" | "severity" | "impact" | "decision" | "default"
  expandable?: boolean
  defaultExpanded?: boolean
  showConfidence?: boolean
  title?: string
  description?: string
}

interface HAXRationaleProps {
  decision: string
  criteria?: RationaleCriterion[]
  reasoning: string
  confidence?: number
  confidenceDescription?: string
  variant?: "priority" | "severity" | "impact" | "decision" | "default"
  expandable?: boolean
  defaultExpanded?: boolean
  showConfidence?: boolean
  title?: string
  description?: string
}

const rationaleVariants = cva(
  "flex flex-col gap-3 rounded-lg border p-4 transition-all duration-200 bg-white border-gray-200",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-white",
        priority: "border-orange-200 bg-orange-50/30",
        severity: "border-red-200 bg-red-50/30",
        impact: "border-blue-200 bg-blue-50/30",
        decision: "border-green-200 bg-green-50/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const getBadgeVariant = (
  value: string,
  sentiment?: "positive" | "negative" | "neutral",
): "default" | "secondary" | "destructive" | "outline" => {
  const lowerValue = value.toLowerCase()

  // Critical values are always destructive regardless of sentiment
  if (lowerValue.includes("critical")) {
    return "destructive"
  }

  // If agent provided sentiment, use it to determine styling
  if (sentiment) {
    if (lowerValue.includes("high")) {
      return sentiment === "positive"
        ? "default"
        : sentiment === "negative"
          ? "destructive"
          : "secondary"
    }
    if (lowerValue.includes("medium") || lowerValue.includes("moderate")) {
      return "secondary"
    }
    if (lowerValue.includes("low")) {
      return sentiment === "positive"
        ? "destructive"
        : sentiment === "negative"
          ? "default"
          : "outline"
    }
  }

  // Fallback to conservative styling when no sentiment provided
  if (lowerValue.includes("high")) {
    return "secondary" // Neutral when uncertain
  }
  if (lowerValue.includes("medium") || lowerValue.includes("moderate")) {
    return "secondary"
  }
  if (lowerValue.includes("low")) {
    return "outline"
  }

  return "outline"
}

const getConfidenceLevel = (
  percentage: number,
): { level: string; color: string } => {
  if (percentage >= 80) return { level: "High", color: "bg-green-400" }
  if (percentage >= 40) return { level: "Medium", color: "bg-orange-400" }
  return { level: "Low", color: "bg-yellow-400" }
}

const getConfidenceBadgeStyle = (percentage: number): string => {
  if (percentage >= 80) return "bg-green-400 text-white border-green-400"
  if (percentage >= 40) return "bg-orange-400 text-white border-orange-400"
  return "bg-yellow-400 text-white border-yellow-400"
}

export function InlineRationale({
  decision,
  criteria = [],
  reasoning,
  confidence,
  confidenceDescription,
  variant = "default",
  expandable = true,
  defaultExpanded = true,
  showConfidence = true,
  title,
  description,
  className,
  ...props
}: InlineRationaleProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  const toggleExpansion = () => {
    if (expandable) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div
      data-slot="inline-rationale"
      className={cn(rationaleVariants({ variant }), className)}
      {...props}
    >
      {/* Header with Title and Badges */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900">
            {title || decision}
          </h3>

          {/* Description */}
          {description && (
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              {description}
            </p>
          )}
        </div>

        {/* Severity and Impact Badges */}
        <div className="ml-4 flex max-w-[50%] flex-wrap gap-2">
          {criteria.map((criterion, index) => (
            <Badge
              key={index}
              variant={getBadgeVariant(criterion.value, criterion.sentiment)}
              className="text-xs font-medium"
              title={criterion.description}
            >
              {criterion.label === "Severity" ? (
                <span className="flex items-center gap-1">
                  {criterion.value === "High" && "⚠️"}
                  {criterion.value === "Medium" && "⚠️"}
                  {criterion.value}
                </span>
              ) : (
                `${criterion.label}: ${criterion.value}`
              )}
            </Badge>
          ))}
          {showConfidence && confidence && (
            <Badge
              variant="outline"
              className={cn(
                "border text-xs",
                getConfidenceBadgeStyle(confidence),
              )}
            >
              {confidence}% confidence
            </Badge>
          )}
        </div>

        {/* Expand/Collapse Button */}
        {expandable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpansion}
            className="ml-2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            {isExpanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        )}
      </div>

      {/* Detailed Reasoning - Expandable */}
      {(isExpanded || !expandable) && reasoning && (
        <div className="animate-in slide-in-from-top-1 mt-3 border-t border-gray-200 pt-3 duration-200">
          <div className="text-sm leading-relaxed text-gray-700">
            {reasoning}
          </div>

          {/* Detailed Criteria Breakdown */}
          {criteria.length > 0 && (
            <div className="mt-3 space-y-1">
              {criteria.map(
                (criterion, index) =>
                  criterion.description && (
                    <div key={index} className="text-xs text-gray-600">
                      <strong className="text-gray-800">
                        {criterion.label}:
                      </strong>{" "}
                      {criterion.description}
                    </div>
                  ),
              )}
            </div>
          )}

          {/* Confidence Details */}
          {confidence && (
            <div className="mt-3 space-y-2">
              {(() => {
                const { level, color } = getConfidenceLevel(confidence)

                return (
                  <div className="flex gap-1">
                    <span className="text-sm font-bold text-gray-800">
                      Confidence:
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                          {level} ({confidence}%)
                        </span>
                        <div className="w-20">
                          <Progress
                            value={confidence}
                            className="h-2 bg-gray-200"
                            indicatorClassName={`rounded-full ${color}`}
                          />
                        </div>
                      </div>
                      {confidenceDescription && (
                        <div className="text-sm text-gray-600">
                          {confidenceDescription}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function HAXRationale({
  decision,
  criteria = [],
  reasoning,
  confidence,
  confidenceDescription,
  variant = "default",
  expandable = true,
  defaultExpanded = true,
  showConfidence = true,
  title,
  description,
}: HAXRationaleProps) {
  return (
    <div className="m-4">
      <InlineRationale
        decision={decision}
        criteria={criteria}
        reasoning={reasoning}
        confidence={confidence}
        confidenceDescription={confidenceDescription}
        variant={variant}
        expandable={expandable}
        defaultExpanded={defaultExpanded}
        showConfidence={showConfidence}
        title={title}
        description={description}
      />
    </div>
  )
}

export { rationaleVariants }
