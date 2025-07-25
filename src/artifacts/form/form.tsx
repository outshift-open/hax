

import React, { useState } from "react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"

export interface FormField {
  type: "text" | "email" | "number" | "select" | "checkbox" | "textarea"
  label: string
  placeholder?: string
  options?: string[]
  required?: boolean
  name?: string
  rows?: number
}

export interface HAXFormProps {
  title?: string
  fields: FormField[]
  isExecuting?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFormSubmit?: (formTitle: string, data: Record<string, any>) => void
  onReset?: () => void
}

export function HAXForm({
  title = "Form",
  fields,
  isExecuting = false,
  onFormSubmit,
  onReset,
}: HAXFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isExecuting) {
      return
    }

    await onFormSubmit?.(title, formData)
  }

  const handleReset = () => {
    if (isExecuting) {
      return
    }

    setFormData({})
    onReset?.()
  }

  const updateField = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getFieldName = (field: FormField, index: number) =>
    field.name ||
    field.label.toLowerCase().replace(/\s+/g, "_") ||
    `field_${index}`

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <div className="mb-5 rounded-md border border-[#D1D1D1] p-4">
        <h3 className="mb-4 text-lg font-semibold">Preview</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field, index) => {
              const fieldName = getFieldName(field, index)

              return (
                <div key={index} className="space-y-1">
                  {field.type !== "checkbox" && (
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </label>
                  )}

                  {field.type === "select" ? (
                    <Select
                      value={formData[fieldName] || ""}
                      onValueChange={(value) => updateField(fieldName, value)}
                    >
                      <SelectTrigger className="h-[34px] rounded-md border-2 border-[#889099] bg-white focus:border-[#1D69CC]">
                        <SelectValue
                          placeholder={
                            field.placeholder || `Select ${field.label}`
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "checkbox" ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={fieldName}
                        checked={formData[fieldName] || false}
                        onChange={(e) =>
                          updateField(fieldName, e.target.checked)
                        }
                        className="rounded border-gray-300 text-[#1D69CC] focus:ring-[#1D69CC]"
                        required={field.required}
                      />
                      <label
                        htmlFor={fieldName}
                        className="text-sm text-gray-700"
                      >
                        {field.label}
                        {field.required && (
                          <span className="ml-1 text-red-500">*</span>
                        )}
                      </label>
                    </div>
                  ) : field.type === "textarea" ? (
                    <textarea
                      placeholder={field.placeholder}
                      value={formData[fieldName] || ""}
                      onChange={(e) => updateField(fieldName, e.target.value)}
                      required={field.required}
                      rows={field.rows || 3}
                      className="min-h-[80px] w-full resize-y rounded-md border-2 border-[#889099] bg-white p-2 text-sm focus:border-[#1D69CC]"
                    />
                  ) : (
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[fieldName] || ""}
                      onChange={(e) => updateField(fieldName, e.target.value)}
                      required={field.required}
                      className="h-[34px] rounded-md border-2 border-[#889099] bg-white focus:border-[#1D69CC]"
                    />
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button
              type="submit"
              className="h-[34px] rounded-md bg-[#1D69CC] px-3 text-sm font-medium text-white hover:bg-[#1D69CC]/90"
            >
              {isExecuting ? "Running..." : "Run"}
            </Button>
            <Button
              type="button"
              onClick={handleReset}
              variant="outline"
              className="font-inter h-[34px] w-16 rounded-md border-2 border-[#1D69CC] bg-white px-3 py-[7px] text-sm leading-5 font-bold tracking-normal text-[#1D69CC] hover:bg-gray-50 disabled:opacity-50"
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
