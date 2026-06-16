import { colors } from "../theme/colors";
import { normalizeTripStats } from "./trip-header.types";
import type { TripHeaderProps } from "./trip-header.types";

export type { TripHeaderProps, TripStat } from "./trip-header.types";
export { normalizeTripStats } from "./trip-header.types";

export function TripHeader({
  title,
  subtitle,
  stats,
  className,
  style,
}: TripHeaderProps) {
  const displayStats = normalizeTripStats(stats);
  const hasStats = Boolean(displayStats?.length);

  return (
    <div
      className={["flex w-full flex-col", className].filter(Boolean).join(" ")}
      style={style as React.CSSProperties}
    >
      <div className="flex flex-col gap-3">
        <span
          className="text-[12px] font-semibold uppercase tracking-[0.1em]"
          style={{ color: colors.brandGhoom }}
        >
          Your trip
        </span>
        <div className="flex flex-col gap-2">
          <h1
            className="text-[30px] font-bold leading-[1.08] tracking-tight"
            style={{ color: colors.textPrimary }}
          >
            {title}
          </h1>
          {subtitle ? (
            <p
              className="text-[16px] leading-relaxed"
              style={{ color: colors.textSecondary }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {hasStats ? (
        <>
          <div
            className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl md:grid-cols-4 lg:hidden"
            style={{ backgroundColor: colors.borderDefault }}
          >
            {displayStats!.map((stat, index) => (
              <div
                key={`${stat.label}-${index}`}
                className="flex flex-col gap-1 px-4 py-3"
                style={{ backgroundColor: colors.bgSurface }}
              >
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.06em]"
                  style={{ color: colors.textMuted }}
                >
                  {stat.label}
                </span>
                <span
                  className="text-[15px] font-semibold leading-tight"
                  style={{ color: colors.textPrimary }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 hidden flex-col gap-2 lg:flex">
            {displayStats!.map((stat, index) => (
              <div
                key={`${stat.label}-sidebar-${index}`}
                className="flex flex-col gap-0.5 rounded-xl px-4 py-3"
                style={{
                  backgroundColor: colors.bgSurface,
                  border: `1px solid ${colors.borderDefault}`,
                }}
              >
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.06em]"
                  style={{ color: colors.textMuted }}
                >
                  {stat.label}
                </span>
                <span
                  className="text-[15px] font-semibold leading-tight"
                  style={{ color: colors.textPrimary }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
