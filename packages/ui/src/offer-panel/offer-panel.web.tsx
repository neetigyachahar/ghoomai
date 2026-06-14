import { colors } from "../theme/colors";
import type { OfferPanelProps } from "./offer-panel.types";

export type { OfferPanelProps } from "./offer-panel.types";

export function OfferPanel({ children, highlight, className, style }: OfferPanelProps) {
  return (
    <div
      className={["overflow-hidden rounded-2xl", className].filter(Boolean).join(" ")}
      style={{
        backgroundColor: colors.bgSurface,
        border: `1px solid ${colors.borderDefault}`,
        borderLeft: `3px solid ${colors.brandGhoom}`,
        ...(style as React.CSSProperties),
      }}
    >
      {highlight ? (
        <div
          className="px-4 pt-3"
          style={{ backgroundColor: colors.bgAccentSoft }}
        >
          <span
            className="inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
            style={{ color: colors.brandGhoom, backgroundColor: colors.bgSurface }}
          >
            {highlight}
          </span>
        </div>
      ) : null}
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}
