"use client";

import { OptionChip } from "../option-chip/option-chip.web";
import { SendArrowIcon } from "../send-arrow-icon/send-arrow-icon.web";
import { colors } from "../theme/colors";
import type { QuestionSheetProps } from "./question-sheet.types";

export type { QuestionSheetProps } from "./question-sheet.types";

function SendSpinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin text-white"
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

export function QuestionSheet({
  question,
  options = [],
  freeTextValue,
  onFreeTextChange,
  onSelectOption,
  onFreeTextSubmit,
  disabled = false,
  loading = false,
}: QuestionSheetProps) {
  const canSubmitFreeText =
    freeTextValue.trim().length > 0 && !disabled && !loading;

  return (
    <div
      className="w-full rounded-2xl border border-stone-200 bg-white p-4"
      style={{ animation: "questionSheetIn 250ms ease-out" }}
    >
      <p
        className="mb-4 text-[17px] font-medium leading-snug"
        style={{ color: colors.textPrimary }}
      >
        {question}
      </p>

      {options.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {options.map((option) => (
            <OptionChip
              key={option}
              label={option}
              onPress={() => onSelectOption(option)}
              disabled={disabled || loading}
            />
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 p-1.5 focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/20">
        <input
          type="text"
          value={freeTextValue}
          onChange={(event) => onFreeTextChange(event.target.value)}
          placeholder="Something else..."
          disabled={disabled || loading}
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[15px] text-stone-900 outline-none placeholder:text-stone-400 disabled:opacity-50"
          onKeyDown={(event) => {
            if (event.key === "Enter" && canSubmitFreeText) {
              event.preventDefault();
              onFreeTextSubmit();
            }
          }}
        />
        <button
          type="button"
          onClick={onFreeTextSubmit}
          disabled={!canSubmitFreeText}
          aria-label="Send answer"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            backgroundColor: canSubmitFreeText ? colors.accent : colors.bgSubtle,
            border: canSubmitFreeText
              ? "none"
              : `1px solid ${colors.borderDefault}`,
          }}
        >
          {loading ? (
            <SendSpinner />
          ) : (
            <SendArrowIcon
              size={16}
              color={canSubmitFreeText ? "#ffffff" : colors.textMuted}
            />
          )}
        </button>
      </div>
    </div>
  );
}
