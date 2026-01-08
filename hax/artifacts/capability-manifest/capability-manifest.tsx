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
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  XCircle,
  Info,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import type {
  CapabilityManifestData,
  Capability,
  CapabilityStatus,
  CapabilityGroup,
  Alert,
  AlertVariant,
  AgentTag,
  ConnectionStatus,
} from "./types";

// ============================================================================
// Type Definitions for Internal Use
// ============================================================================

interface ResolvedAgentHeader {
  name: string;
  role?: string;
  statusText?: string;
  tags?: AgentTag[];
}

interface ResolvedStatusInfo {
  status: ConnectionStatus;
  label?: string;
  sessionId?: string;
  metadata?: Record<string, string | number>;
  color?: string;
}

export interface HAXCapabilityManifestProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: CapabilityManifestData;
  onCapabilityClick?: (capability: Capability) => void;
  onAlertDismiss?: (alert: Alert) => void;
  onStatusClick?: () => void;
}

// ============================================================================
// Helper Components
// ============================================================================

const alertVariantStyles: Record<
  AlertVariant,
  { bg: string; border: string; text: string; icon: LucideIcon }
> = {
  warning: {
    bg: "bg-[#fef3c7]",
    border: "border-[#fcd34d]",
    text: "text-[#b45309]",
    icon: AlertTriangle,
  },
  error: {
    bg: "bg-[#fee2e2]",
    border: "border-[#fca5a5]",
    text: "text-[#dc2626]",
    icon: XCircle,
  },
  info: {
    bg: "bg-[#dbeafe]",
    border: "border-[#93c5fd]",
    text: "text-[#1d4ed8]",
    icon: Info,
  },
  success: {
    bg: "bg-[#dcfce7]",
    border: "border-[#86efac]",
    text: "text-[#16a34a]",
    icon: CheckCircle2,
  },
};

const statusColors: Record<ConnectionStatus, string> = {
  connected: "#2ca02c",
  connecting: "#f59e0b",
  disconnected: "#64748b",
  error: "#dc2626",
};

const statusLabels: Record<ConnectionStatus, string> = {
  connected: "Connected",
  connecting: "Connecting...",
  disconnected: "Disconnected",
  error: "Connection Error",
};

const capabilityStatusIcons: Record<
  CapabilityStatus,
  { icon: LucideIcon; color: string }
> = {
  enabled: { icon: CheckCircle2, color: "#2ca02c" },
  disabled: { icon: Circle, color: "#64748b" },
  pending: { icon: AlertCircle, color: "#f59e0b" },
  error: { icon: XCircle, color: "#dc2626" },
};

const sizeStyles = {
  sm: { padding: "p-4", gap: "gap-3", text: "text-sm" },
  md: { padding: "p-6", gap: "gap-4", text: "text-base" },
  lg: { padding: "p-8", gap: "gap-5", text: "text-lg" },
};

const variantStyles = {
  default:
    "bg-white border border-solid border-[#e2e8f0] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]",
  outline: "bg-transparent border border-solid border-[#e2e8f0]",
  ghost: "bg-transparent",
};

// ============================================================================
// Sub-Components
// ============================================================================

interface AlertItemProps {
  alert: Alert;
  onDismiss?: (alert: Alert) => void;
}

function AlertItem({ alert, onDismiss }: AlertItemProps) {
  const styles = alertVariantStyles[alert.variant];
  const IconComponent = styles.icon;

  return (
    <div
      className={cn(
        styles.bg,
        "border border-solid",
        styles.border,
        "rounded-lg p-4 flex gap-3 items-start w-full",
      )}
    >
      <div className="shrink-0 pt-[3px]">
        <IconComponent className={cn("size-4", styles.text)} />
      </div>
      <div
        className={cn(
          "flex-1 flex flex-col gap-px text-sm leading-[21px] tracking-[0.07px]",
          styles.text,
        )}
      >
        <p className="font-semibold">{alert.title}</p>
        <p className="font-normal">{alert.description}</p>
      </div>
      {alert.dismissible && (
        <button
          onClick={() => onDismiss?.(alert)}
          className={cn("shrink-0 p-1 hover:opacity-70", styles.text)}
          aria-label="Dismiss alert"
        >
          <XCircle className="size-4" />
        </button>
      )}
    </div>
  );
}

interface CapabilityItemProps {
  capability: Capability;
  onClick?: (capability: Capability) => void;
}

function CapabilityItem({ capability, onClick }: CapabilityItemProps) {
  const statusConfig = capabilityStatusIcons[capability.status];
  const IconComponent = statusConfig.icon;
  const iconColor = capability.iconColor || statusConfig.color;

  const handleClick = () => {
    onClick?.(capability);
  };

  return (
    <div
      className={cn(
        "flex gap-2 items-center min-h-[32px] px-2 py-[5.5px] rounded-md w-full",
        onClick && "cursor-pointer hover:bg-[#f8fafc] transition-colors",
      )}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="shrink-0 size-5 flex items-center justify-center">
        <IconComponent className="size-4" style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-normal leading-[21px] text-[#020617] tracking-[0.07px] truncate">
          {capability.name}
        </p>
        {capability.description && (
          <p className="text-xs text-[#64748b] truncate">
            {capability.description}
          </p>
        )}
      </div>
      {capability.metadata && (
        <div className="shrink-0 text-xs text-[#64748b]">
          {Object.entries(capability.metadata)
            .slice(0, 2)
            .map(([key, value]) => (
              <span key={key} className="ml-2">
                {String(value)}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}

interface CapabilityGroupComponentProps {
  group: CapabilityGroup;
  onCapabilityClick?: (capability: Capability) => void;
}

function CapabilityGroupComponent({
  group,
  onCapabilityClick,
}: CapabilityGroupComponentProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(
    group.defaultCollapsed ?? false,
  );

  return (
    <div className="flex flex-col gap-0.5 w-full">
      <div
        className={cn(
          "flex items-center min-h-[32px] px-2 py-[5.5px] rounded-md w-full",
          group.collapsible && "cursor-pointer hover:bg-[#f8fafc]",
        )}
        onClick={() => group.collapsible && setIsCollapsed(!isCollapsed)}
      >
        <p className="text-sm font-medium leading-[21px] text-[#020617] tracking-[0.07px]">
          {group.label}
        </p>
        {group.collapsible && (
          <span className="ml-auto text-[#64748b]">
            {isCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </span>
        )}
      </div>
      {!isCollapsed && (
        <div className="flex flex-col gap-0.5 w-full">
          {group.capabilities.map((capability) => (
            <CapabilityItem
              key={capability.id}
              capability={capability}
              onClick={onCapabilityClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * HAXCapabilityManifest - A component for displaying AI agent capabilities,
 * constraints, and connection status.
 *
 * Designed for AI agents to dynamically render their capabilities, tools,
 * constraints, and session information in a standardized format.
 *
 * @example
 * ```tsx
 * <HAXCapabilityManifest
 *   data={{
 *     agentName: "Data Analyst",
 *     agentRole: "Agent",
 *     statusText: "Ready for interaction",
 *     capabilities: [
 *       { id: "1", name: "SQL Query", status: "enabled" },
 *       { id: "2", name: "Visualization", status: "enabled" }
 *     ],
 *     alerts: [{
 *       id: "1",
 *       title: "API Limits",
 *       description: "Rate limited to 100 req/min",
 *       variant: "warning"
 *     }],
 *     connectionStatus: "connected",
 *     sessionId: "HAX-2024-001"
 *   }}
 * />
 * ```
 */
export function HAXCapabilityManifest({
  data,
  onCapabilityClick,
  onAlertDismiss,
  onStatusClick,
  className,
  ...props
}: HAXCapabilityManifestProps) {
  const {
    // Agent header
    agentName = "Agent",
    agentRole,
    statusText = "Capability handshake initiated • Ready for interaction",
    agentTags = [],

    // Capabilities
    capabilities = [],
    capabilityGroups,
    capabilitiesLabel = "Capabilities",
    showCapabilities = true,

    // Alerts
    alerts = [],

    // Status
    connectionStatus = "connected",
    connectionLabel,
    sessionId,
    statusMetadata,

    // Customization
    showSeparator = true,
    showStatus = true,

    // Styling
    variant = "default",
    size = "md",
    showShadow = true,
  } = data;

  // Resolve agent header
  const resolvedAgent: ResolvedAgentHeader = {
    name: agentName,
    role: agentRole,
    statusText,
    tags: agentTags,
  };

  // Resolve status info
  const resolvedStatus: ResolvedStatusInfo = {
    status: connectionStatus,
    label: connectionLabel,
    sessionId,
    metadata: statusMetadata,
  };

  // Convert flat capabilities to groups if no groups provided
  const resolvedGroups: CapabilityGroup[] = capabilityGroups ?? [
    {
      id: "__default__",
      label: capabilitiesLabel,
      capabilities: capabilities,
    },
  ];

  const hasCapabilities = resolvedGroups.some((g) => g.capabilities.length > 0);

  const sizeConfig = sizeStyles[size];
  const statusColor =
    resolvedStatus.color ?? statusColors[resolvedStatus.status];
  const statusLabel =
    resolvedStatus.label ?? statusLabels[resolvedStatus.status];

  return (
    <div
      className={cn(
        "rounded-lg w-full",
        sizeConfig.padding,
        variantStyles[variant],
        !showShadow && "shadow-none",
        className,
      )}
      {...props}
    >
      <div className={cn("flex flex-col w-full", sizeConfig.gap)}>
        {/* Agent Header */}
        <div className="flex flex-col gap-1 w-full">
          <div className="flex gap-2 items-center">
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 items-center flex-wrap">
                <p
                  className={cn(
                    "font-semibold leading-6 text-[#171717]",
                    sizeConfig.text,
                  )}
                >
                  {resolvedAgent.role
                    ? `${resolvedAgent.role}: ${resolvedAgent.name}`
                    : resolvedAgent.name}
                </p>
                {resolvedAgent.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      tag.variant === "filled"
                        ? "bg-[#020617] text-white"
                        : tag.variant === "outline"
                          ? "border border-[#e2e8f0] text-[#64748b]"
                          : "bg-[#f1f5f9] text-[#64748b]",
                    )}
                    style={
                      tag.color ? { backgroundColor: tag.color } : undefined
                    }
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {resolvedAgent.statusText && (
            <p className="text-sm font-normal leading-[21px] text-[#64748b] tracking-[0.07px]">
              {resolvedAgent.statusText}
            </p>
          )}
        </div>

        {/* Capabilities Section */}
        {showCapabilities && hasCapabilities && (
          <div className="flex flex-col gap-2 w-full">
            {resolvedGroups.map((group) =>
              group.id === "__default__" ? (
                <React.Fragment key={group.id}>
                  <div className="flex items-center min-h-[32px] px-2 py-[5.5px] rounded-md w-full">
                    <p className="text-sm font-medium leading-[21px] text-[#020617] tracking-[0.07px]">
                      {group.label}
                    </p>
                  </div>
                  <div className="flex flex-col gap-0.5 w-full">
                    {group.capabilities.map((capability) => (
                      <CapabilityItem
                        key={capability.id}
                        capability={capability}
                        onClick={onCapabilityClick}
                      />
                    ))}
                  </div>
                </React.Fragment>
              ) : (
                <CapabilityGroupComponent
                  key={group.id}
                  group={group}
                  onCapabilityClick={onCapabilityClick}
                />
              ),
            )}
          </div>
        )}

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="flex flex-col gap-2 w-full">
            {alerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onDismiss={onAlertDismiss}
              />
            ))}
          </div>
        )}

        {/* Separator */}
        {showSeparator && showStatus && (
          <div className="w-full h-px bg-[#e2e8f0]" />
        )}

        {/* Status Footer */}
        {showStatus && (
          <div
            className={cn(
              "flex gap-2 items-center justify-between min-h-[32px] px-2 py-[5.5px] rounded-md w-full",
              onStatusClick && "cursor-pointer hover:bg-[#f8fafc]",
            )}
            onClick={onStatusClick}
          >
            <div className="flex gap-2 items-center">
              <div className="shrink-0 size-5 flex items-center justify-center">
                <div
                  className={cn(
                    "size-2 rounded-full",
                    resolvedStatus.status === "connecting" && "animate-pulse",
                  )}
                  style={{ backgroundColor: statusColor }}
                />
              </div>
              <p className="text-xs font-normal leading-4 text-[#020617] tracking-[0.18px]">
                {statusLabel}
              </p>
            </div>
            <div className="flex gap-4 items-center">
              {resolvedStatus.metadata &&
                Object.entries(resolvedStatus.metadata).map(([key, value]) => (
                  <p
                    key={key}
                    className="text-xs font-normal leading-4 text-[#64748b] tracking-[0.18px]"
                  >
                    {key}: {value}
                  </p>
                ))}
              {resolvedStatus.sessionId && (
                <p className="text-xs font-normal leading-4 text-[#64748b] tracking-[0.18px]">
                  Session: {resolvedStatus.sessionId}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HAXCapabilityManifest;
