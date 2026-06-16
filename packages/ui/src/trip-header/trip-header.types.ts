import type { CSSProperties } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface TripStat {
  label: string;
  value: string;
}

/** Stats grid renders as 2×1 or 2×2 — only 2 or 4 items are valid. */
export function normalizeTripStats(stats?: TripStat[]): TripStat[] | undefined {
  if (!stats?.length) {
    return undefined;
  }

  if (stats.length === 1 || stats.length === 3) {
    if (stats.length === 1) {
      return undefined;
    }

    return stats.slice(0, 2);
  }

  if (stats.length > 4) {
    return stats.slice(0, 4);
  }

  return stats;
}

export interface TripHeaderProps {
  title: string;
  subtitle?: string;
  stats?: TripStat[];
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}
