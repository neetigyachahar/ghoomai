import type { TextProps } from "./text.types";

export type { TextProps, TextVariant } from "./text.types";

const variantStyles: Record<NonNullable<TextProps["variant"]>, string> = {
  body: "text-sm text-zinc-700",
  title: "text-lg font-semibold text-zinc-900",
};

export function Text({
  children,
  variant = "body",
  className,
  style,
}: TextProps) {
  const Tag = variant === "title" ? "p" : "span";

  return (
    <Tag
      className={[variantStyles[variant], className].filter(Boolean).join(" ")}
      style={style as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
