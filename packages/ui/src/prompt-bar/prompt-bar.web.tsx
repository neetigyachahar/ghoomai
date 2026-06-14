"use client";

import { colors } from "../theme/colors";
import { SendArrowIcon } from "../send-arrow-icon/send-arrow-icon.web";
import type { PromptBarProps } from "./prompt-bar.types";

export type { PromptBarProps } from "./prompt-bar.types";

function SendSpinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
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

export function PromptBar({
  value,
  onChangeText,
  placeholder = "What's on your mind?",
  onSubmit,
  disabled = false,
  loading = false,
}: PromptBarProps) {
  const canSubmit = value.trim().length > 0 && !disabled && !loading;

  return (
    <div className="flex w-full items-center gap-2 rounded-2xl border border-stone-200 bg-white py-2.5 pl-4 pr-2 transition-colors focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/20">
      <textarea
        value={value}
        onChange={(event) => onChangeText(event.target.value)}
        placeholder={placeholder}
        rows={1}
        disabled={disabled || loading}
        className="max-h-32 min-h-[22px] flex-1 resize-none bg-transparent py-0 text-[17px] leading-[22px] text-stone-900 outline-none placeholder:text-stone-400 disabled:opacity-50"
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey && canSubmit) {
            event.preventDefault();
            onSubmit?.();
          }
        }}
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        aria-label="Send"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors disabled:cursor-not-allowed"
        style={{
          backgroundColor: canSubmit ? colors.accent : colors.bgSubtle,
          border: canSubmit ? "none" : `1px solid ${colors.borderDefault}`,
        }}
      >
        {loading ? (
          <SendSpinner />
        ) : (
          <SendArrowIcon
            color={canSubmit ? "#ffffff" : colors.textMuted}
          />
        )}
      </button>
    </div>
  );
}
