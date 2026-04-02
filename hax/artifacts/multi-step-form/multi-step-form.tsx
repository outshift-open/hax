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
import { Check } from "lucide-react"
import type { StepData, FormFieldData } from "./types"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HAXMultiStepFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  title?: string;
  badge?: string;
  steps?: StepData[];
  currentStep?: number;
  formTitle?: string;
  fields?: FormFieldData[];
  values?: Record<string, string>;
  errors?: Record<string, string>;
  onFieldChange?: (name: string, value: string) => void;
  onBack?: () => void;
  onNext?: (values: Record<string, string>) => void;
  isSubmitting?: boolean;
  backLabel?: string;
  nextLabel?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_STEPS: StepData[] = [
  { id: "account", label: "Account" },
  { id: "profile", label: "Profile" },
  { id: "complete", label: "Complete" },
];

const DEFAULT_FIELDS: FormFieldData[] = [
  { name: "fullName", label: "Full Name", placeholder: "John Doe" },
  { name: "jobTitle", label: "Job Title", placeholder: "Product Designer" },
];

const EMPTY_VALUES: Record<string, string> = {};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

type StepStatus = "completed" | "active" | "upcoming";

function StepperIcon({
  stepNumber,
  status,
}: {
  stepNumber: number;
  status: StepStatus;
}) {
  if (status === "completed") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#020617]">
        <Check className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
    );
  }

  if (status === "active") {
    return (
      <div
        aria-current="step"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#020617]"
      >
        <span className="text-sm font-semibold text-white">{stepNumber}</span>
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#E2E8F0]">
      <span className="text-sm font-semibold text-[#64748B]">{stepNumber}</span>
    </div>
  );
}

function Stepper({
  steps,
  currentStep,
}: {
  steps: StepData[];
  currentStep: number;
}) {
  const getStatus = (index: number): StepStatus =>
    index < currentStep
      ? "completed"
      : index === currentStep
      ? "active"
      : "upcoming";

  return (
    <div className="w-full">
      {/* Row 1: circles + connecting lines */}
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <StepperIcon stepNumber={index + 1} status={getStatus(index)} />
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-[2px]",
                  index < currentStep ? "bg-[#020617]" : "bg-[#E2E8F0]"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Row 2: labels aligned under circles */}
      <div className="flex mt-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="w-10 shrink-0 flex justify-center">
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  getStatus(index) === "upcoming"
                    ? "text-[#64748B]"
                    : "text-[#020617]"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && <div className="flex-1" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function HAXMultiStepForm({
  title = "Multi-Step Form",
  badge,
  steps = DEFAULT_STEPS,
  currentStep = 1,
  formTitle = "Profile Information",
  fields = DEFAULT_FIELDS,
  values = EMPTY_VALUES,
  errors,
  onFieldChange,
  onBack,
  onNext,
  isSubmitting = false,
  backLabel = "Back",
  nextLabel = "Continue",
  className,
  ...rest
}: HAXMultiStepFormProps) {
  const clampedStep = Math.max(0, Math.min(currentStep, steps.length - 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitting) onNext?.(values);
  };

  return (
    <form
      {...rest}
      onSubmit={handleSubmit}
      className={cn(
        "w-full rounded-2xl border border-[#E2E8F0] bg-white p-6",
        className
      )}
    >
      {/* Header: title left, badge right */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#0F172A]">{title}</h2>
        {badge && (
          <span className="text-xs font-medium text-[#3B82F6] bg-[#EFF6FF] border border-[#DBEAFE] rounded-full px-3 py-1">
            {badge}
          </span>
        )}
      </div>

      {/* Stepper */}
      <div className="mb-6">
        <Stepper steps={steps} currentStep={clampedStep} />
      </div>

      {/* Form fields */}
      <div className="space-y-5">
        {formTitle && (
          <h3 className="text-base font-semibold text-[#0F172A]">
            {formTitle}
          </h3>
        )}

        {fields.map((field) => {
          const fieldError = errors?.[field.name];
          return (
            <div key={field.name} className="space-y-1.5">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-[#0F172A]"
              >
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-0.5">*</span>
                )}
              </label>
              <input
                id={field.name}
                type={field.type || "text"}
                placeholder={field.placeholder}
                required={field.required}
                value={values[field.name] ?? ""}
                onChange={(e) => onFieldChange?.(field.name, e.target.value)}
                aria-invalid={!!fieldError}
                aria-describedby={fieldError ? `${field.name}-error` : undefined}
                className={cn(
                  "w-full rounded-lg border bg-white px-3 py-2.5",
                  "text-sm text-[#0F172A] placeholder:text-[#94A3B8]",
                  "outline-none transition-colors",
                  fieldError
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                )}
              />
              {fieldError && (
                <p id={`${field.name}-error`} className="text-xs text-red-500">
                  {fieldError}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5",
            "text-sm font-medium text-[#0F172A]",
            "hover:bg-[#F8FAFC] transition-colors"
          )}
        >
          {backLabel}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "rounded-lg bg-[#020617] px-4 py-2.5",
            "text-sm font-medium text-white",
            "hover:bg-[#1E293B] transition-colors",
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSubmitting ? "Submitting..." : nextLabel}
        </button>
      </div>
    </form>
  );
}
