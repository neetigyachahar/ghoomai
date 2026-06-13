"use client";

import type { ButtonProps } from "./button.types";

export type { ButtonProps, ButtonVariant } from "./button.types";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "rounded-full bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300",
  secondary:
    "rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900",
};

export function Button({
  children,
  variant = "primary",
  onPress,
}: ButtonProps) {
  return (
    <button type="button" className={variantStyles[variant]} onClick={onPress}>
      {children}
    </button>
  );
}
