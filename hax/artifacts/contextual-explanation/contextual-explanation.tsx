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
import { Button } from "@/components/ui/button"

export interface ExplanationDetail {
  /** Label for the detail row */
  label: string
  /** Value/description for the detail row */
  value: string
  /** Optional additional info (e.g., timestamp) */
  additionalInfo?: string
  /** Whether this is a sub-item (indented) */
  isSubItem?: boolean
  /** Whether the label should be bold */
  isBoldLabel?: boolean
}

export interface ContextualExplanationCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Title displayed in the card header */
  title?: string
  /** Alert title explaining why the change happened */
  alertTitle?: string
  /** Alert description with more details */
  alertDescription?: string
  /** Array of detail rows to display */
  details: ExplanationDetail[]
  /** Text for the secondary button */
  secondaryButtonLabel?: string
  /** Text for the primary button */
  primaryButtonLabel?: string
  /** Callback when secondary button is clicked */
  onSecondaryClick?: () => void
  /** Callback when primary button is clicked */
  onPrimaryClick?: () => void
}

/**
 * ContextualExplanationCard - Card component for displaying contextual explanations
 *
 * Uses Figma design system variables:
 * - Background: card/card (#ffffff)
 * - Border: general/border (#e2e8f0)
 * - Border radius: semantic/rounded-lg (8px)
 * - Padding: semantic/xl (24px)
 * - Shadow: shadow-sm
 */
export function ContextualExplanationCard({
  title = "Contextual Explanation",
  alertTitle = "Why this happened",
  alertDescription = "Agent based on observation modified behaviour of the system",
  details,
  secondaryButtonLabel = "Dismiss",
  primaryButtonLabel = "Approve",
  onSecondaryClick,
  onPrimaryClick,
  className,
  ...props
}: ContextualExplanationCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-solid border-[#e2e8f0]",
        "rounded-lg px-6 py-6 w-full",
        "shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]",
        "flex flex-col",
        className,
      )}
      {...props}
    >
      {/* Card Header */}
      <div className="pb-6">
        <p className="text-base font-semibold leading-6 text-[#171717]">
          {title}
        </p>
      </div>

      {/* Why This Happened Alert Section */}
      <div className="w-full">
        <div className="bg-white border border-solid border-[#e2e8f0] rounded-lg p-4 flex gap-4 items-center">
          <div className="flex-1 flex flex-col gap-px">
            <p className="text-sm font-semibold leading-[21px] tracking-[0.07px] text-[#020617]">
              {alertTitle}
            </p>
            <p className="text-sm font-normal leading-[21px] tracking-[0.07px] text-[#64748b]">
              {alertDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col gap-2 py-6">
        <p className="text-base font-medium leading-6 text-[#020617]">Details</p>
        <div className="flex flex-col gap-2">
          {details.map((detail, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-4 items-start h-[21px]",
                detail.isSubItem && "pl-4",
              )}
            >
              <p
                className={cn(
                  "text-sm leading-[21px] tracking-[0.07px] text-[#0f172a] w-[266px] shrink-0",
                  detail.isBoldLabel ? "font-semibold" : "font-normal",
                )}
              >
                {detail.label}
              </p>
              {detail.value && (
                <p className="text-sm font-normal leading-[21px] tracking-[0.07px] text-[#020617] w-[224px]">
                  {detail.value}
                  {detail.additionalInfo && (
                    <span className="text-[#64748b]">
                      {" "}
                      {detail.additionalInfo}
                    </span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Button Group Section */}
      <div className="flex gap-2 items-center justify-end py-2">
        <Button
          variant="secondary"
          onClick={onSecondaryClick}
          className={cn(
            "h-9 px-4 py-[7.5px] min-h-[36px]",
            "bg-[#f1f5f9] hover:bg-[#e2e8f0]",
            "text-sm font-semibold leading-[21px] tracking-[0.07px] text-[#0f172a]",
            "rounded-lg",
          )}
        >
          {secondaryButtonLabel}
        </Button>
        <Button
          onClick={onPrimaryClick}
          className={cn(
            "h-9 px-4 py-[7.5px] min-h-[36px]",
            "bg-[#0f172a] hover:bg-[#1e293b]",
            "text-sm font-semibold leading-[21px] tracking-[0.07px] text-[#f8fafc]",
            "rounded-lg",
          )}
        >
          {primaryButtonLabel}
        </Button>
      </div>
    </div>
  )
}

interface HAXContextualExplanationProps {
  title?: string
  alertTitle?: string
  alertDescription?: string
  details: ExplanationDetail[]
  secondaryButtonLabel?: string
  primaryButtonLabel?: string
  onSecondaryClick?: () => void
  onPrimaryClick?: () => void
}

export function HAXContextualExplanation({
  title,
  alertTitle,
  alertDescription,
  details,
  secondaryButtonLabel,
  primaryButtonLabel,
  onSecondaryClick,
  onPrimaryClick,
}: HAXContextualExplanationProps) {
  return (
    <div className="m-4">
      <ContextualExplanationCard
        title={title}
        alertTitle={alertTitle}
        alertDescription={alertDescription}
        details={details}
        secondaryButtonLabel={secondaryButtonLabel}
        primaryButtonLabel={primaryButtonLabel}
        onSecondaryClick={onSecondaryClick}
        onPrimaryClick={onPrimaryClick}
      />
    </div>
  )
}

export default ContextualExplanationCard
