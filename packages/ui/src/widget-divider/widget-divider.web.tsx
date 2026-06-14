import { colors } from "../theme/colors";
import type { WidgetDividerProps } from "./widget-divider.types";

export type { WidgetDividerProps } from "./widget-divider.types";

export function WidgetDivider({ className, style }: WidgetDividerProps) {
  return (
    <div
      role="separator"
      className={className}
      style={{
        height: 1,
        backgroundColor: colors.borderDefault,
        marginBlock: 4,
        ...(style as React.CSSProperties),
      }}
    />
  );
}
