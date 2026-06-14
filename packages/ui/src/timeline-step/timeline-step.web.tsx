import { colors } from "../theme/colors";
import type { TimelineStepProps } from "./timeline-step.types";

export type { TimelineStepProps } from "./timeline-step.types";

export function TimelineStep({
  dayLabel,
  label,
  time,
  note,
  isLast = false,
  children,
  className,
  style,
}: TimelineStepProps) {
  const hasHeader = Boolean(dayLabel || label || time || note);

  return (
    <div
      className={["flex w-full flex-col", className].filter(Boolean).join(" ")}
      style={{
        paddingBottom: isLast ? 0 : 24,
        ...(style as React.CSSProperties),
      }}
    >
      {hasHeader ? (
        <div className="mb-3 flex flex-col gap-1.5">
          {dayLabel ? (
            <span
              className="text-[12px] font-semibold uppercase tracking-[0.06em]"
              style={{ color: colors.brandGhoom }}
            >
              {dayLabel}
            </span>
          ) : null}
          {label || time ? (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              {label ? (
                <span
                  className="text-[16px] font-semibold leading-snug"
                  style={{ color: colors.textPrimary }}
                >
                  {label}
                </span>
              ) : null}
              {time ? (
                <span
                  className="text-[13px] font-medium"
                  style={{ color: colors.textMuted }}
                >
                  {time}
                </span>
              ) : null}
            </div>
          ) : null}
          {note ? (
            <p
              className="text-[14px] leading-relaxed"
              style={{ color: colors.textSecondary }}
            >
              {note}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}
