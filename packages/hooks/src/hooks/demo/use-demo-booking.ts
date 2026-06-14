"use client";

import { useContext } from "react";

import { DemoBookingContext } from "../../context/demo/demo-booking-context";

export function useDemoBooking() {
  const context = useContext(DemoBookingContext);

  if (!context) {
    throw new Error("useDemoBooking must be used within DemoBookingProvider");
  }

  return context;
}
