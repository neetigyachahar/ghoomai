import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  onPress?: () => void;
}
