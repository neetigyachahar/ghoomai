import type { BoxProps } from "./box.types";

export type { BoxProps } from "./box.types";

export function Box({ children, className, style }: BoxProps) {
  return (
    <div className={className} style={style as React.CSSProperties}>
      {children}
    </div>
  );
}
