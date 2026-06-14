import type { CSSProperties, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import type { TravelResourceType } from "@repo/types";

export type TravelOfferTagTone = "teal" | "orange" | "stone";

export interface TravelOfferTag {
  label: string;
  tone?: TravelOfferTagTone;
}

export interface TravelOfferLayoutProps {
  type: TravelResourceType;
  header: ReactNode;
  footer: ReactNode;
  tag?: TravelOfferTag;
  highlight?: string;
  className?: string;
  style?: CSSProperties | StyleProp<ViewStyle>;
}
