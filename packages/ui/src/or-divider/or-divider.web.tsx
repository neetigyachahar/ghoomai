import { colors } from "../theme/colors";
import type { OrDividerProps } from "./or-divider.types";

export type { OrDividerProps } from "./or-divider.types";

export function OrDivider({ className, style }: OrDividerProps) {
  return (
    <div
      className={["flex items-center gap-4 py-1", className].filter(Boolean).join(" ")}
      style={style as React.CSSProperties}
      role="separator"
      aria-label="or"
    >
      <div className="h-px flex-1" style={{ backgroundColor: colors.borderDefault }} />
      <span
        className="text-[13px] font-medium uppercase tracking-wide"
        style={{ color: colors.textMuted }}
      >
        or
      </span>
      <div className="h-px flex-1" style={{ backgroundColor: colors.borderDefault }} />
    </div>
  );
}
