"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { TIMELINE_STATUSES, TimelineItem } from "./types";

interface HaxTimelineProps {
  title?: string;
  items: TimelineItem[];
  onItemToggle?: (itemId: string) => void;
  className?: string;
}

export type TimelineStatus = (typeof TIMELINE_STATUSES)[number];

const getStatusIcon = (status: TimelineStatus) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-3 w-3 text-[#2774D9]" />;
    case "pending":
      return <Clock className="h-3 w-3 text-yellow-500" />;
    case "in_progress":
      return <Loader2 className="h-3 w-3 animate-spin text-blue-500" />;
    case "warning":
      return <AlertCircle className="h-3 w-3 text-orange-500" />;
    case "error":
      return <XCircle className="h-3 w-3 text-red-500" />;
    case "input_required":
      return <Clock className="h-3 w-3 text-[#F59E0B]" />;
    default:
      return <CheckCircle className="h-3 w-3 text-[#2774D9]" />;
  }
};

const getStatusColor = (status: TimelineStatus) => {
  switch (status) {
    case "completed":
      return "border-[#2774D9] bg-white";
    case "pending":
      return "border-yellow-500 bg-yellow-50";
    case "in_progress":
      return "border-blue-500 bg-blue-50";
    case "warning":
      return "border-orange-500 bg-orange-50";
    case "error":
      return "border-red-500 bg-red-50";
    default:
      return "border-[#2774D9] bg-white";
  }
};

export function HAXTimeline({
  title = "Activity Timeline",
  items,
  onItemToggle,
}: HaxTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    () => new Set(items.map((item) => item.id))
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getDisplayTime = (item: TimelineItem): string => {
    if (item.timestamp) {
      return formatDistanceToNow(item.timestamp, { addSuffix: true });
    }
    return item.timeAgo || "unknown time";
  };
  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
    onItemToggle?.(itemId);
  };

  return (
    <div className="h-full w-full">
      <h3 className="mb-4 text-center text-lg font-semibold">{title}</h3>

      <div className="h-[600px] overflow-y-auto rounded-lg border bg-white p-4">
        <div className="relative space-y-0">
          {items.length > 1 && (
            <div className="absolute top-[9px] bottom-0 left-[25px] z-0 w-0.5 bg-[#2774D9]" />
          )}

          {items.map((item, index) => {
            const isExpanded = expandedItems.has(item.id);
            const isLast = index === items.length - 1;
            const displayTime = getDisplayTime(item);

            return (
              <div key={item.id} className="relative">
                <div className="flex items-start gap-4 pl-4">
                  <div className="flex flex-shrink-0 flex-col items-center">
                    <div
                      className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 ${getStatusColor(
                        item.status
                      )} relative z-10`}
                    >
                      {getStatusIcon(item.status)}
                    </div>
                  </div>

                  <div className="flex-1 pb-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 flex h-[18px] w-[18px] items-center justify-center">
                        <button
                          onClick={() => toggleExpanded(item.id)}
                          className="flex h-full w-full items-center justify-center rounded transition-colors hover:bg-gray-100"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-[#7E868F]" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-[#7E868F]" />
                          )}
                        </button>
                      </div>

                      <div className="flex-1">
                        <h4 className="font-inter text-sm leading-5 font-semibold text-[#373C42]">
                          {item.title}
                        </h4>
                        <p className="font-inter mt-1 text-sm leading-5 text-[#596069]">
                          {displayTime}
                        </p>

                        {isExpanded && item.description && (
                          <p className="font-inter mt-2 text-sm leading-5 text-[#596069]">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {!isLast && (
                  <div className="relative z-5 mb-4 ml-[34px] h-px bg-[#E1E4E8]" />
                )}
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="flex h-32 items-center justify-center text-[#7E868F]">
              <p className="text-sm">No timeline activities yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
