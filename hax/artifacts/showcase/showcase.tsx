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
import { Eye, Heart, TrendingUp, Star, Clock3, ArrowRight } from "lucide-react"
import type {
  ShowcaseArtifact,
  ShowcaseItemData,
  ShowcaseCategoryData,
  ShowcaseVariant,
} from "./types"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const cardShadow = "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)"
const sectionIcons = { trending: TrendingUp, star: Star, clock: Clock3 }
const sectionIconBg: Record<string, string> = {
  trending: "#f3e8ff",
  star: "#dbeafe",
  clock: "#ffedd5",
}

// ---------------------------------------------------------------------------
// Sub-components (not exported)
// ---------------------------------------------------------------------------

/* ---------- PaginationDots ---------- */

function PaginationDots({ total, active = 0 }: { total: number; active?: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 rounded-full transition-all",
            i === active ? "w-6 bg-[#0F172A]" : "w-2 bg-[#E2E8F0]"
          )}
        />
      ))}
    </div>
  )
}

/* ---------- MediaPlaceholder ---------- */

function MediaPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-[#E2E8F0] bg-white",
        className
      )}
      style={{ boxShadow: cardShadow }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100" />
      <div className="absolute inset-0 opacity-20">
        <div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(226,232,240,0.3) 50%, rgba(255,255,255,0.6) 100%)",
          }}
        />
      </div>
    </div>
  )
}

/* ---------- Badge ---------- */

function Badge({
  label,
  variant = "default",
}: {
  label: string
  variant?: "default" | "purple"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold tracking-wide",
        variant === "purple"
          ? "bg-purple-50 text-purple-600"
          : "bg-[#F1F5F9] text-[#0F172A]"
      )}
    >
      {label}
    </span>
  )
}

/* ---------- CardContainer (text area below image) ---------- */

function CardContainer({
  item,
  showButtons = false,
  clamp = false,
  padding = "p-1",
  onPreview,
  onFavorite,
}: {
  item: ShowcaseItemData
  showButtons?: boolean
  clamp?: boolean
  padding?: string
  onPreview?: () => void
  onFavorite?: () => void
}) {
  return (
    <div className={cn(padding, "space-y-2.5")}>
      {item.badge && <Badge label={item.badge} />}
      <div className="space-y-1 px-1">
        <h3
          className={cn(
            "text-base font-medium text-[#020617]",
            clamp && "line-clamp-1"
          )}
        >
          {item.title}
        </h3>
        <p
          className={cn(
            "text-sm leading-[21px] tracking-[0.07px] text-[#64748B]",
            clamp && "line-clamp-1"
          )}
        >
          {item.description}
        </p>
      </div>
      {showButtons && (
        <div className="flex items-center gap-4">
          <Button variant="default" size="sm" onClick={onPreview}>
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <button
            type="button"
            onClick={onFavorite}
            className="inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] p-2 hover:bg-gray-50 transition-colors"
            style={{ boxShadow: cardShadow }}
          >
            <Heart className="h-4 w-4 text-[#020617]" />
          </button>
        </div>
      )}
    </div>
  )
}

/* ---------- CardVariation2: Vertical Card ---------- */

function VerticalCard({
  item,
  imageHeight = "h-[260px]",
  showButtons = false,
  clamp = false,
  onPreview,
  onFavorite,
}: {
  item: ShowcaseItemData
  imageHeight?: string
  showButtons?: boolean
  clamp?: boolean
  onPreview?: () => void
  onFavorite?: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="rounded-2xl bg-[#F3F4F6] p-4"
        style={{ boxShadow: cardShadow }}
      >
        <div className="relative">
          <MediaPlaceholder className={cn("w-full", imageHeight)} />
          {item.badge && (
            <div className="absolute top-3 left-3">
              <Badge label={item.badge} />
            </div>
          )}
        </div>
      </div>
      <CardContainer
        item={item}
        showButtons={showButtons}
        clamp={clamp}
        onPreview={onPreview}
        onFavorite={onFavorite}
      />
    </div>
  )
}

/* ---------- CardVariation3: Horizontal Card ---------- */

function HorizontalCard({
  item,
  onPreview,
  onFavorite,
}: {
  item: ShowcaseItemData
  onPreview?: () => void
  onFavorite?: () => void
}) {
  return (
    <div className="flex gap-6 rounded-2xl bg-white border border-[#E2E8F0] p-6">
      <MediaPlaceholder className="h-36 w-36 shrink-0" />
      <div className="flex flex-1 flex-col justify-between">
        <CardContainer
          item={item}
          showButtons
          onPreview={onPreview}
          onFavorite={onFavorite}
        />
      </div>
    </div>
  )
}

/* ---------- CardVariation4: Overlay Card ---------- */

function OverlayCard({
  item,
  width,
  height,
  onPreview,
  onFavorite,
}: {
  item: ShowcaseItemData
  width?: string
  height?: string
  onPreview?: () => void
  onFavorite?: () => void
}) {
  return (
    <div
      className={cn(
        width ?? "w-full",
        height ?? "h-[260px]",
        "shrink-0 relative flex flex-col justify-end rounded-2xl overflow-hidden border border-[#E2E8F0]"
      )}
      style={{ boxShadow: cardShadow }}
    >
      <div className="absolute inset-0">
        <MediaPlaceholder className="w-full h-full !rounded-none !border-0 !shadow-none" />
      </div>
      <div className="relative z-10 bg-white/90 backdrop-blur-sm p-6">
        <CardContainer
          item={item}
          padding="p-0"
          onPreview={onPreview}
          onFavorite={onFavorite}
        />
      </div>
    </div>
  )
}

/* ---------- CardVariation5: Masonry Card ---------- */

function MasonryCard({ item, tall = false }: { item: ShowcaseItemData; tall?: boolean }) {
  const h = tall ? "h-[420px]" : "h-[292px]"
  const imgH = tall ? "h-[307px]" : "h-[179px]"

  return (
    <div
      className={cn("w-full rounded-lg overflow-hidden border border-[#E2E8F0] flex flex-col", h)}
      style={{ boxShadow: cardShadow }}
    >
      <MediaPlaceholder className={cn("w-full shrink-0 !rounded-none !border-0 !shadow-none", imgH)} />
      <div className="flex-1 p-4">
        <CardContainer item={item} clamp padding="p-0" />
      </div>
    </div>
  )
}

/* ---------- CardVariation6: Hero Card ---------- */

function HeroCard({
  item,
  onPreview,
  onFavorite,
}: {
  item: ShowcaseItemData
  onPreview?: () => void
  onFavorite?: () => void
}) {
  return (
    <div
      className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-[#E2E8F0]"
      style={{ boxShadow: cardShadow }}
    >
      <MediaPlaceholder className="absolute inset-0 w-full h-full !rounded-none !border-0 !shadow-none" />
      <div className="relative z-10 flex flex-col justify-end h-full p-6">
        <CardContainer
          item={item}
          showButtons
          padding="p-0"
          onPreview={onPreview}
          onFavorite={onFavorite}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// View Variations
// ---------------------------------------------------------------------------

/* ---------- Grid View (3x2) ---------- */

function GridView({
  items,
  onPreview,
  onFavorite,
}: {
  items: ShowcaseItemData[]
  onPreview?: (item: ShowcaseItemData) => void
  onFavorite?: (item: ShowcaseItemData) => void
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-[18px]">
        {items.slice(0, 6).map((item) => (
          <VerticalCard
            key={item.id}
            item={item}
            imageHeight="h-[260px]"
            onPreview={() => onPreview?.(item)}
            onFavorite={() => onFavorite?.(item)}
          />
        ))}
      </div>
      <PaginationDots total={2} active={0} />
    </div>
  )
}

/* ---------- List View (Horizontal Cards) ---------- */

function ListView({
  items,
  onPreview,
  onFavorite,
}: {
  items: ShowcaseItemData[]
  onPreview?: (item: ShowcaseItemData) => void
  onFavorite?: (item: ShowcaseItemData) => void
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-8">
        {items.slice(0, 6).map((item) => (
          <HorizontalCard
            key={item.id}
            item={item}
            onPreview={() => onPreview?.(item)}
            onFavorite={() => onFavorite?.(item)}
          />
        ))}
      </div>
      <PaginationDots total={2} active={0} />
    </div>
  )
}

/* ---------- Dense Grid View (4x3) ---------- */

function DenseGridView({
  items,
  onPreview,
  onFavorite,
}: {
  items: ShowcaseItemData[]
  onPreview?: (item: ShowcaseItemData) => void
  onFavorite?: (item: ShowcaseItemData) => void
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {items.slice(0, 12).map((item) => (
          <VerticalCard
            key={item.id}
            item={item}
            imageHeight="h-[166px]"
            clamp
            onPreview={() => onPreview?.(item)}
            onFavorite={() => onFavorite?.(item)}
          />
        ))}
      </div>
      <PaginationDots total={2} active={0} />
    </div>
  )
}

/* ---------- Table View ---------- */

function TableView({
  items,
  onPreview,
  onFavorite,
}: {
  items: ShowcaseItemData[]
  onPreview?: (item: ShowcaseItemData) => void
  onFavorite?: (item: ShowcaseItemData) => void
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-5 px-4 py-2 border-b border-[#E2E8F0]">
          <div className="w-[72px] shrink-0 text-sm font-semibold text-[#020617]">Preview</div>
          <div className="flex-[2] text-sm font-semibold text-[#020617]">Title</div>
          <div className="flex-[2] text-sm font-semibold text-[#020617]">Author</div>
          <div className="flex-[2] text-sm font-semibold text-[#020617]">Category</div>
          <div className="w-[88px] shrink-0 text-sm font-semibold text-[#020617]">Actions</div>
        </div>
        <div className="space-y-4">
          {items.slice(0, 10).map((item) => (
            <div key={item.id} className="flex items-center gap-5 px-4 py-1">
              <div className="w-[72px] shrink-0">
                <MediaPlaceholder className="w-[72px] h-12" />
              </div>
              <div className="flex-[2] text-sm text-[#020617] truncate">{item.title}</div>
              <div className="flex-[2] text-sm text-[#020617] truncate">{item.author ?? "—"}</div>
              <div className="flex-[2]">
                {item.category ? <Badge label={item.category} variant="purple" /> : "—"}
              </div>
              <div className="w-[88px] shrink-0 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onPreview?.(item)}
                  className="inline-flex items-center justify-center rounded-lg bg-[#F1F5F9] p-2 hover:bg-[#E2E8F0] transition-colors"
                >
                  <Eye className="h-4 w-4 text-[#020617]" />
                </button>
                <button
                  type="button"
                  onClick={() => onFavorite?.(item)}
                  className="inline-flex items-center justify-center rounded-lg bg-[#F1F5F9] p-2 hover:bg-[#E2E8F0] transition-colors"
                >
                  <Heart className="h-4 w-4 text-[#020617]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <PaginationDots total={2} active={0} />
    </div>
  )
}

/* ---------- Categorized View ---------- */

function CategorizedView({
  categories,
  onPreview,
  onFavorite,
}: {
  categories: ShowcaseCategoryData[]
  onPreview?: (item: ShowcaseItemData) => void
  onFavorite?: (item: ShowcaseItemData) => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-16">
        {categories.map((section, idx) => {
          const Icon = section.icon ? sectionIcons[section.icon] : null
          const iconBg = section.icon ? sectionIconBg[section.icon] : "#f3f4f6"
          const sectionItems = section.items.slice(0, 3)
          return (
            <div key={idx} className="flex flex-col gap-8">
              <div className="flex items-center justify-between px-5">
                <div className="flex items-center gap-3">
                  {Icon && (
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-md"
                      style={{ backgroundColor: iconBg }}
                    >
                      <Icon className="h-5 w-5 text-[#020617]" />
                    </div>
                  )}
                  <h3 className="text-base font-semibold text-[#020617]">{section.title}</h3>
                </div>
                <button
                  type="button"
                  className="flex items-center justify-center w-9 h-9 rounded-md bg-white hover:bg-gray-50 transition-colors"
                >
                  <ArrowRight className="h-4 w-4 text-[#020617]" />
                </button>
              </div>
              <div className="flex gap-6">
                {sectionItems[0] && (
                  <OverlayCard
                    item={sectionItems[0]}
                    width="w-[320px]"
                    height="h-[260px]"
                    onPreview={() => onPreview?.(sectionItems[0])}
                    onFavorite={() => onFavorite?.(sectionItems[0])}
                  />
                )}
                {sectionItems[1] && (
                  <OverlayCard
                    item={sectionItems[1]}
                    width="w-[280px]"
                    height="h-[200px]"
                    onPreview={() => onPreview?.(sectionItems[1])}
                    onFavorite={() => onFavorite?.(sectionItems[1])}
                  />
                )}
                {sectionItems[2] && (
                  <OverlayCard
                    item={sectionItems[2]}
                    width="w-[280px]"
                    height="h-[200px]"
                    onPreview={() => onPreview?.(sectionItems[2])}
                    onFavorite={() => onFavorite?.(sectionItems[2])}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
      <PaginationDots total={2} active={0} />
    </div>
  )
}

/* ---------- Featured/Masonry View ---------- */

function FeaturedView({
  items,
  onPreview,
  onFavorite,
}: {
  items: ShowcaseItemData[]
  onPreview?: (item: ShowcaseItemData) => void
  onFavorite?: (item: ShowcaseItemData) => void
}) {
  const hero = items[0]
  const grid = items.slice(1, 10)
  const col1 = [grid[0], grid[3], grid[6]]
  const col2 = [grid[1], grid[4], grid[7]]
  const col3 = [grid[2], grid[5], grid[8]]
  const col1Pattern = [true, false, false]
  const col2Pattern = [false, false, true]
  const col3Pattern = [false, false, true]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-16">
        {hero && (
          <HeroCard
            item={hero}
            onPreview={() => onPreview?.(hero)}
            onFavorite={() => onFavorite?.(hero)}
          />
        )}
        <div className="grid grid-cols-3 gap-4 items-start">
          <div className="flex flex-col gap-6">
            {col1.map(
              (item, i) =>
                item && <MasonryCard key={item.id} item={item} tall={col1Pattern[i]} />
            )}
          </div>
          <div className="flex flex-col gap-6">
            {col2.map(
              (item, i) =>
                item && <MasonryCard key={item.id} item={item} tall={col2Pattern[i]} />
            )}
          </div>
          <div className="flex flex-col gap-6">
            {col3.map(
              (item, i) =>
                item && <MasonryCard key={item.id} item={item} tall={col3Pattern[i]} />
            )}
          </div>
        </div>
      </div>
      <PaginationDots total={2} active={0} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export interface HAXShowcaseProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ShowcaseArtifact["data"]["variant"]
  items?: ShowcaseArtifact["data"]["items"]
  categories?: ShowcaseArtifact["data"]["categories"]
  onPreview?: (item: ShowcaseItemData) => void
  onFavorite?: (item: ShowcaseItemData) => void
}

export function HAXShowcase({
  variant = "grid",
  items = [],
  categories = [],
  onPreview,
  onFavorite,
  className,
  ...rest
}: HAXShowcaseProps) {
  const shared = { items, onPreview, onFavorite }

  return (
    <div className={cn("w-full", className)} {...rest}>
      {variant === "grid" && <GridView {...shared} />}
      {variant === "list" && <ListView {...shared} />}
      {variant === "dense-grid" && <DenseGridView {...shared} />}
      {variant === "table" && <TableView {...shared} />}
      {variant === "categorized" && (
        <CategorizedView
          categories={categories}
          onPreview={onPreview}
          onFavorite={onFavorite}
        />
      )}
      {variant === "featured" && <FeaturedView {...shared} />}
    </div>
  )
}