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

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GeneratedUiWrapper } from "@/components/generated-ui-wrapper";
import {
  CalendarIcon,
  ClockIcon,
  VideoIcon,
  UsersIcon,
} from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import type { WorkshopCardData } from "./types";

// ============================================================================
// Types
// ============================================================================

export interface Attendee {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface EventDetailItemProps {
  icon?: React.ReactNode;
  label: React.ReactNode;
  sublabel?: React.ReactNode;
  className?: string;
}

export interface ActionButtonConfig {
  label: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconAfter?: React.ReactNode;
  hidden?: boolean;
}

export interface BadgeConfig {
  label: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  hidden?: boolean;
}

export interface StatusConfig {
  key: string;
  label: string;
  className: string;
}

export interface AvatarStackProps {
  attendees: Attendee[];
  totalCount: number;
  maxDisplay?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  renderOverflow?: (count: number) => React.ReactNode;
}

// ============================================================================
// Sub-components
// ============================================================================

function EventDetailItem({
  icon,
  label,
  sublabel,
  className,
}: EventDetailItemProps) {
  return (
    <div className={cn("flex items-start gap-2 px-2 py-1.5 min-h-8", className)}>
      {icon && (
        <div className="flex-shrink-0 size-5 text-foreground">
          {icon}
        </div>
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-normal text-foreground tracking-[0.07px] leading-[21px]">
          {label}
        </span>
        {sublabel && (
          <span className="text-sm font-normal text-muted-foreground tracking-[0.07px] leading-[21px]">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}

const avatarSizes = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
};

function AvatarStack({
  attendees,
  totalCount,
  maxDisplay = 3,
  size = "md",
  className,
  renderOverflow,
}: AvatarStackProps) {
  const displayedAttendees = attendees.slice(0, maxDisplay);
  const remainingCount = totalCount - displayedAttendees.length;

  return (
    <div className={cn("flex items-center pr-2", className)}>
      {displayedAttendees.map((attendee, index) => (
        <Avatar
          key={attendee.id}
          className={cn(
            avatarSizes[size],
            "border border-white",
            index > 0 && "-ml-2"
          )}
        >
          {attendee.avatarUrl ? (
            <AvatarImage src={attendee.avatarUrl} alt={attendee.name} />
          ) : (
            <AvatarFallback className="bg-muted text-xs">
              {attendee.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
      ))}
      {remainingCount > 0 &&
        (renderOverflow ? (
          renderOverflow(remainingCount)
        ) : (
          <div
            className={cn(
              avatarSizes[size],
              "rounded-full bg-secondary flex items-center justify-center -ml-2",
              "text-xs font-semibold text-foreground tracking-[0.18px]"
            )}
          >
            +{remainingCount}
          </div>
        ))}
    </div>
  );
}

const defaultStatusConfigs: Record<string, StatusConfig> = {
  confirmed: {
    key: "confirmed",
    label: "Confirmed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  pending: {
    key: "pending",
    label: "Pending",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  cancelled: {
    key: "cancelled",
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

function StatusBadge({
  status,
  customConfigs,
}: {
  status: string | BadgeConfig;
  customConfigs?: Record<string, StatusConfig>;
}) {
  if (typeof status === "object") {
    if (status.hidden) return null;
    return (
      <Badge
        variant={status.variant || "outline"}
        className={cn("font-medium", status.className)}
      >
        {status.label}
      </Badge>
    );
  }

  const configs = { ...defaultStatusConfigs, ...customConfigs };
  const config = configs[status];

  if (!config) return null;

  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

function ActionButton({ config }: { config: ActionButtonConfig }) {
  if (config.hidden) return null;

  return (
    <Button
      variant={config.variant || "outline"}
      size={config.size || "sm"}
      onClick={config.onClick}
      disabled={config.disabled}
      className={config.className}
    >
      {config.icon}
      {config.label}
      {config.iconAfter}
    </Button>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export interface HAXWorkshopCardProps extends WorkshopCardData {
  className?: string;
  onJoin?: () => void;
  onDecline?: () => void;
  onMaybe?: () => void;
  onAddToCalendar?: () => void;
}

export function HAXWorkshopCard({
  className,
  title,
  description,
  eventType = "Online Event",
  status = "confirmed",
  date,
  time,
  duration,
  location,
  attendeeCount = 0,
  attendees = [],
  maxDisplayedAttendees = 3,
  showJoinButton = true,
  showDeclineButton = true,
  showMaybeButton = true,
  onJoin,
  onDecline,
  onMaybe,
  onAddToCalendar,
}: HAXWorkshopCardProps) {
  const eventTypeBadge: BadgeConfig = {
    label: eventType,
    className: "bg-violet-50 text-violet-700 border-violet-200",
  };

  const parsedAttendees: Attendee[] = attendees.map((a, idx) => ({
    id: a.id || `attendee-${idx}`,
    name: a.name,
    avatarUrl: a.avatarUrl,
  }));

  return (
    <GeneratedUiWrapper title="Workshop Card">
      <div
        className={cn(
          "bg-white rounded-lg border border-border shadow-sm",
          "flex flex-col gap-4 p-5",
          "max-w-md w-full",
          className
        )}
      >
        {/* Header with badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 bg-secondary rounded-lg flex items-center justify-center">
              <CalendarIcon className="size-4 text-foreground" />
            </div>
            <Badge
              variant={eventTypeBadge.variant || "outline"}
              className={cn("font-medium", eventTypeBadge.className)}
            >
              {eventTypeBadge.label}
            </Badge>
          </div>
          {status && <StatusBadge status={status} />}
        </div>

        {/* Title and description */}
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-foreground leading-6 tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground leading-[21px] tracking-[0.07px]">
              {description}
            </p>
          )}
        </div>

        {/* Event details */}
        <div className="flex flex-col">
          {date && (
            <EventDetailItem
              icon={<CalendarIcon className="size-5" />}
              label={date}
              sublabel={
                onAddToCalendar ? (
                  <button
                    onClick={onAddToCalendar}
                    className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Add to calendar
                  </button>
                ) : undefined
              }
            />
          )}
          {time && (
            <EventDetailItem
              icon={<ClockIcon className="size-5" />}
              label={time}
              sublabel={duration}
            />
          )}
          {location && (
            <EventDetailItem
              icon={<VideoIcon className="size-5" />}
              label={location}
            />
          )}
          {attendeeCount > 0 && (
            <div className="flex items-start gap-2 px-2 py-1.5 min-h-8">
              <div className="flex-shrink-0 size-5 text-foreground">
                <UsersIcon className="size-5" />
              </div>
              <div className="flex flex-col flex-1 min-w-0 gap-2">
                <span className="text-sm font-normal text-foreground tracking-[0.07px] leading-[21px]">
                  {attendeeCount} attendee{attendeeCount !== 1 ? "s" : ""}
                </span>
                {parsedAttendees.length > 0 && (
                  <AvatarStack
                    attendees={parsedAttendees}
                    totalCount={attendeeCount}
                    maxDisplay={maxDisplayedAttendees}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2 justify-end">
          {showDeclineButton && (
            <ActionButton
              config={{
                label: "Decline",
                variant: "outline",
                onClick: onDecline,
              }}
            />
          )}
          {showMaybeButton && (
            <ActionButton
              config={{
                label: "Maybe",
                variant: "outline",
                onClick: onMaybe,
              }}
            />
          )}
          {showJoinButton && (
            <ActionButton
              config={{
                label: "Join Event",
                variant: "default",
                onClick: onJoin,
              }}
            />
          )}
        </div>
      </div>
    </GeneratedUiWrapper>
  );
}

export {
  EventDetailItem,
  AvatarStack,
  StatusBadge,
  ActionButton,
  defaultStatusConfigs,
};
