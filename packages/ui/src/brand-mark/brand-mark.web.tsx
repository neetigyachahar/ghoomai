import { colors } from "../theme/colors";
import type { BrandMarkProps } from "./brand-mark.types";

export type { BrandMarkProps } from "./brand-mark.types";

const sizeClasses = {
  default: "text-[40px] md:text-[52px]",
  large: "text-[52px] md:text-[64px]",
};

export function BrandMark({
  className,
  size = "default",
  tagline = "Plan your trips with ease",
}: BrandMarkProps) {
  return (
    <div className={["flex flex-col items-center gap-3", className].filter(Boolean).join(" ")}>
      <div
        className={["select-none text-center font-bold tracking-tight", sizeClasses[size]]
          .filter(Boolean)
          .join(" ")}
        style={{ letterSpacing: "-0.02em" }}
        aria-label="GhoomAI"
      >
        <span style={{ color: colors.brandGhoom }}>Ghoom</span>
        <span style={{ color: colors.brandAi }}>AI</span>
      </div>
      {tagline ? (
        <p
          className="text-center text-[15px] font-normal md:text-base"
          style={{ color: colors.textSecondary }}
        >
          {tagline}
        </p>
      ) : null}
    </div>
  );
}
