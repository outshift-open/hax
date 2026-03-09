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
import { useState, useMemo } from "react"
import { ArrowUpDown, Pencil, Trash2, Check } from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// ---------------------------------------------------------------------------
// Utility function (inlined to avoid path alias dependency)
// ---------------------------------------------------------------------------

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ---------------------------------------------------------------------------
// Internal Checkbox component (inlined to avoid dependency on @/components/ui)
// ---------------------------------------------------------------------------

interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

function Checkbox({ checked = false, onCheckedChange, className }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked && "bg-gray-900 border-gray-900 text-white",
        className
      )}
    >
      {checked && <Check className="h-3 w-3 mx-auto" />}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CellValue =
  | string
  | number
  | { type: "avatar"; initials: string; name: string }
  | { type: "progress"; value: number }
  | { type: "labels"; items: LabelItem[] }

export interface LabelItem {
  text: string
  color?: "red" | "green" | "blue" | "orange" | "gray"
}

export interface DataTableColumn {
  id: string
  header: string
  sortable?: boolean
  align?: "left" | "right" | "center"
}

export interface DataTableRow {
  id: string
  cells: Record<string, CellValue>
}

export interface HAXDataTableProps {
  columns: DataTableColumn[]
  rows: DataTableRow[]
  selectable?: boolean
  showActions?: boolean
  onEdit?: (rowId: string) => void
  onDelete?: (rowId: string) => void
  onSelectionChange?: (selectedIds: string[]) => void
  className?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getProgressColor(value: number): string {
  if (value <= 25) return "#EF4444"
  if (value <= 50) return "#F97316"
  if (value <= 75) return "#EAB308"
  return "#22C55E"
}

function getLabelClasses(color?: string): string {
  switch (color) {
    case "red":
      return "bg-red-500 text-white border-red-500"
    case "green":
      return "bg-green-100 text-green-800 border-green-200"
    case "blue":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "orange":
      return "bg-orange-100 text-orange-800 border-orange-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

// ---------------------------------------------------------------------------
// Cell renderers
// ---------------------------------------------------------------------------

function AvatarCell({ initials, name }: { initials: string; name: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
        {initials}
      </div>
      <span className="text-sm font-medium text-gray-900">{name}</span>
    </div>
  )
}

function ProgressCell({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-2 w-full max-w-[140px] overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${clamped}%`,
            backgroundColor: getProgressColor(clamped),
          }}
        />
      </div>
      <span className="text-sm text-gray-500">{clamped}%</span>
    </div>
  )
}

function LabelsCell({ items }: { items: LabelItem[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((label, i) => (
        <span
          key={i}
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
            getLabelClasses(label.color)
          )}
        >
          {label.text}
        </span>
      ))}
    </div>
  )
}

function renderCell(value: CellValue) {
  if (value === null || value === undefined) return null

  if (typeof value === "string") {
    return <span className="text-sm text-gray-600">{value}</span>
  }

  if (typeof value === "number") {
    return <span className="text-sm text-gray-600">{value}</span>
  }

  switch (value.type) {
    case "avatar":
      return <AvatarCell initials={value.initials} name={value.name} />
    case "progress":
      return <ProgressCell value={value.value} />
    case "labels":
      return <LabelsCell items={value.items} />
    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// HAXDataTable component
// ---------------------------------------------------------------------------

export function HAXDataTable({
  columns,
  rows,
  selectable = true,
  showActions = true,
  onEdit,
  onDelete,
  onSelectionChange,
  className,
}: HAXDataTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const allSelected = rows.length > 0 && selectedIds.size === rows.length

  const toggleSelectAll = () => {
    const next = allSelected ? new Set<string>() : new Set(rows.map((r) => r.id))
    setSelectedIds(next)
    onSelectionChange?.([...next])
  }

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
    onSelectionChange?.([...next])
  }

  const handleSort = (colId: string) => {
    if (sortColumn === colId) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortColumn(colId)
      setSortDirection("asc")
    }
  }

  const sortedRows = useMemo(() => {
    if (!sortColumn) return rows
    return [...rows].sort((a, b) => {
      const av = a.cells[sortColumn]
      const bv = b.cells[sortColumn]

      const aStr = typeof av === "string" ? av : typeof av === "number" ? String(av) : ""
      const bStr = typeof bv === "string" ? bv : typeof bv === "number" ? String(bv) : ""

      const cmp = aStr.localeCompare(bStr, undefined, { numeric: true })
      return sortDirection === "asc" ? cmp : -cmp
    })
  }, [rows, sortColumn, sortDirection])

  return (
    <div className={cn("mx-auto w-full max-w-4xl p-4", className)}>
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            {/* Header */}
            <thead>
              <tr className="bg-[#F8FAFC]">
                {selectable && (
                  <th className="w-[52px] px-4 py-2.5">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className={cn(
                      "px-3 py-2.5 text-left text-sm font-semibold text-gray-900",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center"
                    )}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 hover:text-gray-700"
                        onClick={() => handleSort(col.id)}
                      >
                        {col.header}
                        <ArrowUpDown className="h-4 w-4 opacity-50" />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
                {showActions && (
                  <th className="w-[100px] px-3 py-2.5 text-right text-sm font-semibold text-gray-900" />
                )}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {sortedRows.map((row) => {
                const isSelected = selectedIds.has(row.id)
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-t border-gray-100 transition-colors",
                      isSelected
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    )}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectRow(row.id)}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={cn(
                          "px-3 py-3",
                          col.align === "right" && "text-right",
                          col.align === "center" && "text-center"
                        )}
                      >
                        {renderCell(row.cells[col.id])}
                      </td>
                    ))}
                    {showActions && (
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            onClick={() => onEdit?.(row.id)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                            onClick={() => onDelete?.(row.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Also export the sub-types for convenience
export type { LabelItem as DataTableLabelItem }
