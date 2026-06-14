import { colors } from "../theme/colors";
import type { WidgetErrorProps } from "./widget-error.types";

export type { WidgetErrorProps } from "./widget-error.types";

export function WidgetError({
  widgetKey,
  message,
  details,
  className,
  style,
}: WidgetErrorProps) {
  return (
    <div
      className={["rounded-xl px-4 py-3", className].filter(Boolean).join(" ")}
      style={{
        backgroundColor: "#FEF2F2",
        border: `1px solid #FECACA`,
        ...(style as React.CSSProperties),
      }}
      role="alert"
    >
      <div className="flex flex-col gap-1">
        <span
          className="text-[13px] font-semibold"
          style={{ color: colors.error }}
        >
          {message}
        </span>
        {widgetKey ? (
          <span className="text-[12px]" style={{ color: colors.textMuted }}>
            Widget: {widgetKey}
          </span>
        ) : null}
        {details ? (
          <span
            className="text-[12px] leading-relaxed"
            style={{ color: colors.textSecondary }}
          >
            {details}
          </span>
        ) : null}
      </div>
    </div>
  );
}
