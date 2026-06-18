"use client";

import type { OptionChipProps } from "./option-chip.types";

export type { OptionChipProps } from "./option-chip.types";

export function OptionChip({
  label,
  onPress,
  disabled = false,
  fullWidth = false,
}: OptionChipProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      className={[
        "border border-stone-200 bg-white px-4 py-2.5 text-[15px] font-medium text-stone-900 transition-all hover:border-teal-700/30 hover:bg-teal-50 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50",
        fullWidth
          ? "w-full rounded-xl text-left leading-snug"
          : "rounded-full",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
