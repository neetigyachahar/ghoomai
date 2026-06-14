"use client";

import { colors } from "../theme/colors";
import type { PlanOptionProps } from "./plan-option.types";

export type { PlanOptionProps } from "./plan-option.types";

export function PlanOption({
  label,
  summary,
  selected = false,
  onPress,
  className,
  style,
}: PlanOptionProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className={[
        "flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition-colors",
        "hover:border-teal-700/40 hover:bg-teal-50/30 active:scale-[0.99]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        backgroundColor: colors.bgSurface,
        border: `1px solid ${selected ? colors.borderFocus : colors.borderDefault}`,
        ...(style as React.CSSProperties),
      }}
    >
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
        style={{
          borderColor: selected ? colors.brandGhoom : colors.borderDefault,
          backgroundColor: selected ? colors.brandGhoom : "transparent",
        }}
        aria-hidden
      >
        {selected ? (
          <span className="h-2 w-2 rounded-full bg-white" />
        ) : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className="text-[16px] font-semibold leading-snug"
          style={{ color: colors.textPrimary }}
        >
          {label}
        </span>
        {summary ? (
          <span
            className="text-[13px] leading-snug"
            style={{ color: colors.textSecondary }}
          >
            {summary}
          </span>
        ) : null}
      </span>
      <span
        className="shrink-0 text-[18px]"
        style={{ color: colors.textMuted }}
        aria-hidden
      >
        ›
      </span>
    </button>
  );
}
