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
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import {
  BotIcon,
  InfoIcon,
  CircleCheckIcon,
  TriangleAlertIcon,
  ShieldCheckIcon,
  ChevronUpIcon,
  CircleCheckBig,
} from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DisclosureCollapsibleItem, DisclosureData } from "./types"

// Utility function for merging class names
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Props interface for the main component
export interface HAXDisclosureProps extends DisclosureData {
  onAccept?: () => void
  onDecline?: () => void
}

// AI Icon with gradient background
function DisclosureAIIcon({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-16 h-16 rounded-xl",
        "bg-gradient-to-br from-[#6366f1] to-[#ec4899]",
        className
      )}
    >
      <BotIcon className="size-8 text-white" />
    </div>
  )
}

// Badge component
function DisclosureBadge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
        "text-xs font-medium text-[#6366f1] bg-[#6366f1]/10",
        className
      )}
    >
      <span className="text-[#6366f1]">+</span>
      {children}
    </span>
  )
}

// Info Alert with gradient border
function DisclosureInfoAlert({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "w-full rounded-lg p-[1px]",
        "bg-gradient-to-r from-[#6366f1] to-[#ec4899]",
        className
      )}
    >
      <div className="flex items-start gap-3 p-4 rounded-[7px] bg-white">
        <InfoIcon className="size-5 text-[#64748b] shrink-0 mt-0.5" />
        <p className="text-sm text-[#374151] leading-relaxed">{children}</p>
      </div>
    </div>
  )
}

// Collapsible Section
function DisclosureCollapsible({
  title,
  icon = "check",
  defaultOpen = true,
  children,
  className,
}: {
  title: string
  icon?: "check" | "warning"
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}) {
  const [open, setOpen] = React.useState(defaultOpen)

  const IconComponent = icon === "warning" ? TriangleAlertIcon : CircleCheckIcon
  const iconColor = icon === "warning" ? "text-amber-500" : "text-emerald-500"

  return (
    <CollapsiblePrimitive.Root
      open={open}
      onOpenChange={setOpen}
      className={cn("w-full border border-[#e2e8f0] rounded-lg overflow-hidden", className)}
    >
      <CollapsiblePrimitive.Trigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-[#f8fafc] transition-colors">
        <div className="flex items-center gap-2">
          <IconComponent className={cn("size-5", iconColor)} />
          <span className="text-sm font-medium text-[#020617]">{title}</span>
        </div>
        <ChevronUpIcon
          className={cn(
            "size-5 text-[#64748b] transition-transform duration-200",
            !open && "rotate-180"
          )}
        />
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content className="px-4 pb-4">
        {children}
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  )
}

// Privacy Info Box
function DisclosurePrivacyBox({
  title = "Privacy & Data",
  children,
  className,
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "w-full flex flex-col gap-1 p-4 rounded-lg",
        "bg-[#eff6ff] border border-[#bfdbfe]",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <ShieldCheckIcon className="size-4 text-[#3b82f6]" />
        <span className="text-sm font-semibold text-[#1d4ed8]">{title}</span>
      </div>
      <p className="text-sm text-[#3b82f6] leading-relaxed">{children}</p>
    </div>
  )
}

// List for capabilities/limitations
function DisclosureList({
  items,
  className,
}: {
  items: string[]
  className?: string
}) {
  return (
    <ul className={cn("space-y-2 pl-7", className)}>
      {items.map((item, index) => (
        <li
          key={index}
          className="text-sm text-[#374151] list-disc marker:text-[#94a3b8]"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

// Button component
function DisclosureButton({
  children,
  variant = "primary",
  className,
  onClick,
}: {
  children: React.ReactNode
  variant?: "primary" | "outline"
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
        variant === "primary" && "bg-[#0f172a] text-white hover:bg-[#1e293b]",
        variant === "outline" && "bg-white text-[#020617] border border-[#e2e8f0] hover:bg-[#f8fafc]",
        className
      )}
    >
      {children}
    </button>
  )
}

// Main HAX Disclosure Component
export function HAXDisclosure({
  title = "Disclosure",
  badge = "AI Powered",
  headline = "Disclosure",
  infoAlert,
  capabilities,
  limitations,
  privacyTitle = "Privacy & Data",
  privacyText,
  actionButtonText = "I Understand, Continue",
  showCancelButton = false,
  cancelButtonText = "Decline",
  onAccept,
  onDecline,
}: HAXDisclosureProps) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
        <h2 className="text-lg font-semibold text-[#020617]">{title}</h2>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center gap-4 px-6 py-6">
        {/* AI Icon and Badge */}
        <DisclosureAIIcon />
        {badge && <DisclosureBadge>{badge}</DisclosureBadge>}

        {/* Headline */}
        {headline && (
          <h3 className="text-2xl font-semibold text-[#020617]">{headline}</h3>
        )}

        {/* Info Alert */}
        {infoAlert && (
          <DisclosureInfoAlert>{infoAlert}</DisclosureInfoAlert>
        )}

        {/* Capabilities */}
        {capabilities && capabilities.items && capabilities.items.length > 0 && (
          <DisclosureCollapsible
            title={capabilities.title || "What I Can Do"}
            icon={capabilities.icon || "check"}
            defaultOpen={capabilities.defaultOpen !== false}
          >
            <DisclosureList items={capabilities.items} />
          </DisclosureCollapsible>
        )}

        {/* Limitations */}
        {limitations && limitations.items && limitations.items.length > 0 && (
          <DisclosureCollapsible
            title={limitations.title || "Important Limitations"}
            icon={limitations.icon || "warning"}
            defaultOpen={limitations.defaultOpen !== false}
          >
            <DisclosureList items={limitations.items} />
          </DisclosureCollapsible>
        )}

        {/* Privacy Box */}
        {privacyText && (
          <DisclosurePrivacyBox title={privacyTitle}>
            {privacyText}
          </DisclosurePrivacyBox>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-[#e2e8f0]">
        {showCancelButton && (
          <DisclosureButton variant="outline" onClick={onDecline}>
            {cancelButtonText}
          </DisclosureButton>
        )}
        <DisclosureButton
          variant="primary"
          className={!showCancelButton ? "w-full" : ""}
          onClick={onAccept}
        >
          <CircleCheckBig className="size-4" />
          {actionButtonText}
        </DisclosureButton>
      </div>
    </div>
  )
}

// Export sub-components for flexibility
export {
  DisclosureAIIcon,
  DisclosureBadge,
  DisclosureInfoAlert,
  DisclosureCollapsible,
  DisclosurePrivacyBox,
  DisclosureList,
  DisclosureButton,
}
