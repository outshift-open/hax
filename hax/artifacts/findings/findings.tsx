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

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { FindingsArtifact, Finding } from "./types";

/* -------------------------------------------------------------------------- */
/*  SourceChip                                                                */
/* -------------------------------------------------------------------------- */

interface SourceChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  isCountChip?: boolean;
}

function SourceChip({
  label,
  isCountChip = false,
  className,
  ...props
}: SourceChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center",
        "px-2 py-[3px] gap-1.5",
        "min-h-[24px]",
        "bg-white/10 border border-solid border-slate-300",
        "rounded-lg",
        "shadow-sm",
        "shrink-0",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "font-sans font-semibold",
          "text-xs leading-4",
          "text-slate-950",
          "tracking-[0.18px] text-center whitespace-nowrap"
        )}
      >
        {label}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  SourceChips                                                               */
/* -------------------------------------------------------------------------- */

interface SourceChipsProps {
  sources: Array<{ label: string; href?: string }>;
  label?: string;
  maxVisible?: number;
}

function SourceChips({
  sources,
  label = "Sources:",
  maxVisible = 2,
}: SourceChipsProps) {
  if (!sources || sources.length === 0) return null;

  const [expanded, setExpanded] = React.useState(false);

  const effectiveMax = Math.max(sources.length >= 2 ? 2 : 1, maxVisible);
  const visibleSources = expanded ? sources : sources.slice(0, effectiveMax);
  const overflowCount = sources.length - effectiveMax;
  const hasOverflow = overflowCount > 0 && !expanded;

  return (
    <div className="flex items-center gap-4 w-full min-w-0">
      <p
        className={cn(
          "font-sans font-normal",
          "text-xs leading-4",
          "text-slate-500",
          "tracking-[0.18px] whitespace-nowrap shrink-0"
        )}
      >
        {label}
      </p>
      <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
        {visibleSources.map((source, index) => (
          <SourceChip key={`${source.label}-${index}`} label={source.label} />
        ))}
        {hasOverflow && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-lg"
            aria-label={`Show all ${sources.length} sources`}
          >
            <SourceChip
              label={`+${overflowCount}`}
              isCountChip
              className="cursor-pointer hover:bg-slate-100 transition-colors"
            />
          </button>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  FindingsCard                                                              */
/* -------------------------------------------------------------------------- */

interface FindingsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  sources?: Array<{ label: string; href?: string }>;
  sourcesLabel?: string;
  maxVisibleSources?: number;
}

function FindingsCard({
  title,
  description,
  sources = [],
  sourcesLabel,
  maxVisibleSources,
  className,
  ...props
}: FindingsCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-center",
        "p-4 gap-4",
        "bg-white border border-solid border-slate-200",
        "rounded-lg",
        "w-full overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="flex gap-3 items-start w-full shrink-0">
        <div
          className={cn(
            "flex flex-col gap-px items-start",
            "text-sm leading-[21px]",
            "tracking-[0.07px]",
            "grow basis-0 min-w-[1px] min-h-[1px]"
          )}
        >
          <p className="font-sans font-semibold text-slate-950 w-full shrink-0">
            {title}
          </p>
          <p className="font-sans font-normal text-slate-500 w-full shrink-0">
            {description}
          </p>
        </div>
      </div>
      {sources.length > 0 && (
        <SourceChips
          sources={sources}
          label={sourcesLabel}
          maxVisible={maxVisibleSources}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  FindingsPanel                                                             */
/* -------------------------------------------------------------------------- */

interface FindingsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  findings: Finding[];
  sourcesLabel?: string;
  maxVisibleSources?: number;
}

function FindingsPanel({
  title,
  findings,
  sourcesLabel,
  maxVisibleSources,
  className,
  ...props
}: FindingsPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start",
        "p-6 gap-2",
        "bg-white border border-solid border-slate-200",
        "rounded-lg",
        "shadow-sm",
        "w-full",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-start gap-1 w-full shrink-0">
        <p
          className={cn(
            "font-sans font-semibold",
            "text-base leading-6",
            "text-neutral-500",
            "w-full"
          )}
        >
          {title}
        </p>
      </div>
      {findings.map((finding) => (
        <FindingsCard
          key={finding.id}
          title={finding.title}
          description={finding.description}
          sources={finding.sources}
          sourcesLabel={sourcesLabel}
          maxVisibleSources={maxVisibleSources}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  HAXFindings (public wrapper)                                              */
/* -------------------------------------------------------------------------- */

export interface HAXFindingsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Header title for the findings panel */
  title: string;
  /** Array of findings to display */
  findings: FindingsArtifact["data"]["findings"];
  /** Custom sources label (default: "Sources:") */
  sourcesLabel?: string;
  /** Maximum source chips to show before "+N" (default: 2) */
  maxVisibleSources?: number;
}

export function HAXFindings({
  title,
  findings,
  sourcesLabel,
  maxVisibleSources,
  className,
  ...props
}: HAXFindingsProps) {
  return (
    <div className={cn("mx-auto w-full max-w-2xl p-4", className)} {...props}>
      <FindingsPanel
        title={title}
        findings={findings}
        sourcesLabel={sourcesLabel}
        maxVisibleSources={maxVisibleSources}
      />
    </div>
  );
}
