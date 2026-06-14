import { colors } from "../theme/colors";
import type { ContentBlockProps } from "./content-block.types";

export type { ContentBlockProps } from "./content-block.types";

export function ContentBlock({ heading, content, className, style }: ContentBlockProps) {
  return (
    <div
      className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}
      style={style as React.CSSProperties}
    >
      {heading ? (
        <p
          className="text-[17px] font-semibold leading-snug tracking-tight"
          style={{ color: colors.textPrimary }}
        >
          {heading}
        </p>
      ) : null}
      {content ? (
        <p
          className="text-[15px] leading-[1.6]"
          style={{ color: colors.textSecondary }}
        >
          {content}
        </p>
      ) : null}
    </div>
  );
}
