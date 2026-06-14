"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface DemoBookingContextValue {
  bookingCount: number;
  bookHotel: () => void;
}

export const DemoBookingContext =
  createContext<DemoBookingContextValue | null>(null);

export function DemoBookingProvider({ children }: { children: ReactNode }) {
  const [bookingCount, setBookingCount] = useState(0);

  const bookHotel = useCallback(() => {
    setBookingCount((count) => count + 1);
  }, []);

  const value = useMemo(
    () => ({
      bookingCount,
      bookHotel,
    }),
    [bookingCount, bookHotel],
  );

  return (
    <DemoBookingContext.Provider value={value}>
      {children}
    </DemoBookingContext.Provider>
  );
}
