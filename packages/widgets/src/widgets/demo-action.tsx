"use client";

import type { ReactNode } from "react";

import { useDemoBooking } from "@repo/hooks/demo";
import { Button } from "@repo/ui/button";

export type DemoActionType = "book" | "info";

export interface DemoActionWidgetProps {
  label: string;
  action?: DemoActionType;
  children?: ReactNode;
}

export function DemoActionWidget({
  label,
  action = "info",
}: DemoActionWidgetProps) {
  const { bookingCount, bookHotel } = useDemoBooking();

  const displayLabel =
    action === "book" ? `${label} (${bookingCount})` : label;
  const onPress = action === "book" ? bookHotel : undefined;

  return <Button onPress={onPress}>{displayLabel}</Button>;
}
