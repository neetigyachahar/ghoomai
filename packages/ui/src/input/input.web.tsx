"use client";

import type { InputProps } from "./input.types";

export type { InputProps } from "./input.types";

export function Input({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  className,
  webStyle,
  onSubmit,
}: InputProps) {
  const baseClassName =
    "w-full max-w-lg rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500";

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(event) => onChangeText(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className={[baseClassName, "min-h-24 resize-y", className]
          .filter(Boolean)
          .join(" ")}
        style={webStyle}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChangeText(event.target.value)}
      placeholder={placeholder}
      className={[baseClassName, className].filter(Boolean).join(" ")}
      style={webStyle}
      onKeyDown={(event) => {
        if (event.key === "Enter" && onSubmit) {
          event.preventDefault();
          onSubmit();
        }
      }}
    />
  );
}
