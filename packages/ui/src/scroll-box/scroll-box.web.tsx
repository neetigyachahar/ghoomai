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
      className={["min-h-0 flex-1 overflow-y-auto", className]
        .filter(Boolean)
        .join(" ")}
      style={style as React.CSSProperties}
    >
      <div
        className={contentContainerClassName}
        style={contentContainerStyle as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
