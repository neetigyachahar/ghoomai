import { colors } from "../theme/colors";
import type { ContentBlockGroupProps } from "./content-block-group.types";

export type {
  ContentBlockGroupItem,
  ContentBlockGroupProps,
} from "./content-block-group.types";

export function ContentBlockGroup({
  items,
  className,
  style,
}: ContentBlockGroupProps) {
  if (items.length === 0) {
    return null;
  }

  const showNumbers =
    items.length > 1 && items.every((item) => Boolean(item.heading));

  return (
    <div
      className={["flex w-full flex-col", className].filter(Boolean).join(" ")}
      style={style as React.CSSProperties}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <article
            key={`${item.heading ?? "item"}-${index}`}
            className="flex w-full gap-3.5 py-5 first:pt-0"
            style={{
              borderBottom: isLast ? undefined : `1px solid ${colors.borderDefault}`,
            }}
          >
            {showNumbers ? (
              <span
                className="mt-0.5 shrink-0 text-[13px] font-semibold tabular-nums"
                style={{ color: colors.brandGhoom, minWidth: 16 }}
              >
                {index + 1}
              </span>
            ) : null}
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              {item.heading ? (
                <h3
                  className="text-[17px] font-semibold leading-snug tracking-tight"
                  style={{ color: colors.textPrimary }}
                >
                  {item.heading}
                </h3>
              ) : null}
              <p
                className="text-[15px] leading-[1.6]"
                style={{ color: colors.textSecondary }}
              >
                {item.content}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
