"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { colors } from "../theme/colors";
import { SendArrowIcon } from "../send-arrow-icon/send-arrow-icon.web";
import type { PromptBarProps } from "./prompt-bar.types";

export type { PromptBarProps } from "./prompt-bar.types";

const MAX_TEXTAREA_HEIGHT = 128;

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
  embedded = false,
}: PromptBarProps) {
  const canSubmit = value.trim().length > 0 && !disabled && !loading;
  const showActiveButton = canSubmit || loading;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMultiline, setIsMultiline] = useState(false);

  const syncTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    const nextHeight = Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT);
    textarea.style.height = `${nextHeight}px`;
    setIsMultiline(nextHeight > 28);
  }, []);

  useEffect(() => {
    syncTextareaHeight();
  }, [value, syncTextareaHeight]);

  const inner = (
    <>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => {
          onChangeText(event.target.value);
          syncTextareaHeight();
        }}
        placeholder={placeholder}
        rows={1}
        disabled={disabled || loading}
        className="max-h-32 min-h-[22px] flex-1 resize-none overflow-y-auto bg-transparent py-0 text-[17px] leading-[22px] text-stone-900 outline-none placeholder:text-stone-400 disabled:opacity-50"
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
          backgroundColor: showActiveButton ? colors.accent : colors.bgSubtle,
          border: showActiveButton ? "none" : `1px solid ${colors.borderDefault}`,
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
    </>
  );

  const rowClassName = [
    "flex w-full gap-2",
    isMultiline ? "items-end" : "items-center",
  ].join(" ");

  if (embedded) {
    return (
      <div className={`${rowClassName} py-2.5 pl-4 pr-2`}>
        {inner}
      </div>
    );
  }

  return (
    <div
      className={`${rowClassName} rounded-2xl border border-stone-200 bg-white py-2.5 pl-4 pr-2 transition-colors focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/20`}
    >
      {inner}
    </div>
  );
}
