import type { TravelResourceType } from "@repo/types";

import { colors } from "../theme/colors";

export const travelTypeIconColors: Record<TravelResourceType, string> = {
  flight: "#0369A1",
  bus: colors.brandGhoom,
  train: "#7C3AED",
  cab: colors.brandAi,
  hotel: "#B45309",
};

export const travelTypeIconBackgrounds: Record<TravelResourceType, string> = {
  flight: "#E0F2FE",
  bus: colors.bgAccentSoft,
  train: "#EDE9FE",
  cab: "#FFEDD5",
  hotel: "#FEF3C7",
};

export const travelTypeIconBoxPadding = 14;
