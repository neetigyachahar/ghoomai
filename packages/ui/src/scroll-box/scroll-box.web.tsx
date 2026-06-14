import type { ScrollBoxProps } from "./scroll-box.types";

export type { ScrollBoxProps } from "./scroll-box.types";

export function ScrollBox({
  children,
  className,
  style,
  contentContainerClassName,
  contentContainerStyle,
}: ScrollBoxProps) {
  return (
    <div
      className={["min-h-0 w-full flex-1 overflow-y-auto", className]
        .filter(Boolean)
        .join(" ")}
      style={style as React.CSSProperties}
    >
      <div
        className={["w-full min-w-0", contentContainerClassName]
          .filter(Boolean)
          .join(" ")}
        style={contentContainerStyle as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
