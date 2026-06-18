"use client";

import { OptionChip } from "../option-chip/option-chip.web";
import { colors } from "../theme/colors";
import type { PromptSuggestionsProps } from "./prompt-suggestions.types";

export type { PromptSuggestionsProps } from "./prompt-suggestions.types";

export function PromptSuggestions({
  suggestions,
  onSelect,
  disabled = false,
}: PromptSuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <p
        className="text-center text-[13px] font-medium tracking-wide text-stone-400"
        style={{ color: colors.textMuted }}
      >
        Try these prompts
      </p>
      <div className="flex flex-col gap-2">
        {suggestions.map((suggestion) => (
          <OptionChip
            key={suggestion}
            label={suggestion}
            onPress={() => onSelect(suggestion)}
            disabled={disabled}
            fullWidth
          />
        ))}
      </div>
    </div>
  );
}
