import { colors } from "../theme/colors";
import type { SectionHeaderProps } from "./section-header.types";

export type { SectionHeaderProps } from "./section-header.types";

export function SectionHeader({
  title,
  description,
  className,
  style,
}: SectionHeaderProps) {
  return (
    <div
      className={["flex flex-col gap-1", className].filter(Boolean).join(" ")}
      style={style as React.CSSProperties}
    >
      <span
        className="inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
        style={{
          color: colors.brandGhoom,
          backgroundColor: colors.bgAccentSoft,
        }}
      >
        {title}
      </span>
      {description ? (
        <p
          className="text-[14px] leading-snug"
          style={{ color: colors.textSecondary }}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
