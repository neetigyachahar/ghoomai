import type { SendArrowIconProps } from "./send-arrow-icon.types";

export type { SendArrowIconProps } from "./send-arrow-icon.types";

export function SendArrowIcon({
  size = 20,
  color = "#ffffff",
}: SendArrowIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
