"use client";

import { LayoutGrid, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

import type { TravelResourceType } from "@repo/types";

import { Text } from "../text/text.web";
import { colors } from "../theme/colors";
import { TravelTypeIcon } from "../travel-type-icon/travel-type-icon.web";
import {
  AI_PROGRESS_LABELS,
  type AiProgressStripProps,
} from "./ai-progress-strip.types";

export type { AiProgressStripProps } from "./ai-progress-strip.types";

const TRAVEL_ICON_TYPES: Partial<Record<AiProgressStripProps["eventType"], TravelResourceType>> =
  {
    search_flights: "flight",
    search_buses: "bus",
    search_trains: "train",
    search_cabs: "cab",
    search_hotels: "hotel",
  };

const EMBEDDED_STRIP_HEIGHT = 36;

function ProgressSpinner({
  accent = false,
  compact = false,
}: {
  accent?: boolean;
  compact?: boolean;
}) {
  return (
    <svg
      className={[
        "animate-spin",
        compact ? "h-3 w-3" : "h-4 w-4",
        accent ? "text-teal-600" : "text-stone-400",
      ].join(" ")}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
      />
    </svg>
  );
}

function EventIcon({
  eventType,
  compact = false,
}: Pick<AiProgressStripProps, "eventType"> & { compact?: boolean }) {
  const travelType = TRAVEL_ICON_TYPES[eventType];
  const iconSize = compact ? 13 : 16;
  const boxSize = compact ? 22 : 26;

  if (travelType) {
    return <TravelTypeIcon type={travelType} size={iconSize} />;
  }

  if (eventType === "get_user_personalization") {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-md bg-white/70"
        style={{ width: boxSize, height: boxSize }}
        aria-hidden
      >
        <SlidersHorizontal size={iconSize} color={colors.accent} strokeWidth={2} />
      </div>
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-md bg-white/70"
      style={{ width: boxSize, height: boxSize }}
      aria-hidden
    >
      <LayoutGrid size={iconSize} color={colors.accent} strokeWidth={2} />
    </div>
  );
}

export function AiProgressStrip({
  eventType,
  embedded = false,
}: AiProgressStripProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, [eventType]);

  const content = (
    <div
      className={[
        "flex w-full items-center",
        embedded ? "gap-2 px-4 py-2" : "gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3",
      ].join(" ")}
      style={
        embedded
          ? {
              backgroundColor: colors.bgAccentMuted,
              borderBottom: `1px solid ${colors.borderFocus}14`,
            }
          : undefined
      }
    >
      <EventIcon eventType={eventType} compact={embedded} />
      <Text
        variant="body"
        className={[
          "flex-1 font-medium",
          embedded ? "text-[13px] text-teal-800" : "text-[15px] text-stone-700",
        ].join(" ")}
        style={{
          flex: 1,
          fontSize: embedded ? 13 : 15,
          lineHeight: embedded ? "18px" : undefined,
          color: embedded ? "#115E59" : colors.textSecondary,
        }}
      >
        {AI_PROGRESS_LABELS[eventType]}
      </Text>
      <ProgressSpinner accent={embedded} compact={embedded} />
    </div>
  );

  if (embedded) {
    return (
      <div
        className="overflow-hidden transition-all duration-250 ease-out"
        style={{
          maxHeight: mounted ? EMBEDDED_STRIP_HEIGHT : 0,
          opacity: mounted ? 1 : 0,
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden transition-all duration-200 ease-out"
      style={{
        maxHeight: mounted ? 56 : 0,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(-8px)",
      }}
    >
      {content}
    </div>
  );
}
