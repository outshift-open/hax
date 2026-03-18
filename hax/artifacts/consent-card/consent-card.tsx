"use client"

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ConsentCardArtifact } from "./types"

// ---------------------------------------------------------------------------
// Utility (inlined to avoid path alias dependency)
// ---------------------------------------------------------------------------
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface HAXConsentCardProps {
  title?: ConsentCardArtifact["data"]["title"]
  description?: ConsentCardArtifact["data"]["description"]
  bulletPoints?: ConsentCardArtifact["data"]["bulletPoints"]
  acceptLabel?: ConsentCardArtifact["data"]["acceptLabel"]
  declineLabel?: ConsentCardArtifact["data"]["declineLabel"]
  onAccept?: () => void
  onDecline?: () => void
  className?: string
}

// ---------------------------------------------------------------------------
// HAXConsentCard component (self-contained)
// ---------------------------------------------------------------------------
export function HAXConsentCard({
  title = "Help Us Make Agntcy Smarter",
  description = "Would you like to contribute to our learning model? By allowing us to learn from your usage patterns, you help the AI provide better suggestions, faster results, and higher accuracy for your future workflows.",
  bulletPoints = [
    "All data is fully anonymized.",
    "Strictly internal use only.",
  ],
  acceptLabel = "Yes, Improve My Experience",
  declineLabel = "Maybe Later",
  onAccept,
  onDecline,
  className,
}: HAXConsentCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[480px] rounded-xl bg-white border border-[#E2E8F0] shadow-lg p-8",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Title */}
        <h4 className="text-xl font-semibold leading-6 text-[#020617]">
          {title}
        </h4>

        {/* Description + Bullet Points */}
        <div className="text-sm font-normal leading-[21px] tracking-[0.07px] text-[#64748B]">
          <p>{description}</p>
          {bulletPoints && bulletPoints.length > 0 && (
            <ul className="mt-3.5 list-disc list-inside space-y-0.5">
              {bulletPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onDecline}
            className={cn(
              "inline-flex items-center justify-center rounded-md px-4 py-2",
              "text-sm font-medium text-[#020617]",
              "border border-[#e2e8f0] bg-white",
              "hover:bg-[#f1f5f9] transition-colors"
            )}
          >
            {declineLabel}
          </button>
          <button
            onClick={onAccept}
            className={cn(
              "inline-flex items-center justify-center rounded-md px-4 py-2",
              "text-sm font-medium text-white bg-[#0f172a]",
              "hover:bg-[#1e293b] transition-colors"
            )}
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
