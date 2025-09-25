import * as React from "react"
import { ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Source } from "./types"

export interface SourceAttributionProps extends React.ComponentProps<"div"> {
  claim: string
  sources: Source[]
  title?: string
  description?: string
}

interface HAXSourceAttributionProps {
  claim: string
  sources: Source[]
  title?: string
  description?: string
}

const sourceAttributionStyles =
  "flex flex-col gap-3 rounded-lg border p-4 transition-all duration-200 bg-white border-gray-200"

export const SourceAttribution = React.forwardRef<
  HTMLDivElement,
  SourceAttributionProps
>(({ claim, sources, title, description, className, ...props }, ref) => {
  const renderSourceBadge = (source: Source) => {
    const BadgeContent = (
      <Badge
        variant="outline"
        className="cursor-pointer transition-colors hover:bg-gray-100"
      >
        {source.title}
        {source.url && <ExternalLink className="ml-1 h-3 w-3" />}
      </Badge>
    )

    if (source.url) {
      return (
        <a
          key={source.id}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          {BadgeContent}
        </a>
      )
    }

    return (
      <span key={source.id} className="inline-block">
        {BadgeContent}
      </span>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(sourceAttributionStyles, className)}
      {...props}
    >
      {title && (
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      )}

      <p className="mb-3 text-sm leading-relaxed text-gray-700">
        {description || claim}
      </p>

      {sources.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sources:</span>
            <div className="flex flex-wrap gap-2">
              {sources.map((source) => renderSourceBadge(source))}
            </div>
          </div>
        </div>
      )}

      {sources.length === 0 && (
        <div className="text-xs text-gray-500 italic">
          No sources provided for this claim.
        </div>
      )}
    </div>
  )
})

SourceAttribution.displayName = "SourceAttribution"

export const HAXSourceAttribution: React.FC<HAXSourceAttributionProps> = (
  props,
) => {
  return (
    <div className="m-4">
      <SourceAttribution {...props} />
    </div>
  )
}
