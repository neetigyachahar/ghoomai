import type {
  Bus,
  Cab,
  Flight,
  Hotel,
  Train,
  TravelResourceType,
} from "@repo/types";

type TravelOffer = Flight | Bus | Train | Cab | Hotel;

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function getOfferPrimaryTitle(
  resourceType: TravelResourceType,
  data: TravelOffer,
): string | null {
  switch (resourceType) {
    case "bus":
      return (data as Bus).operator;
    case "train":
      return (data as Train).name;
    case "flight":
      return (data as Flight).airline;
    case "cab":
      return (data as Cab).provider;
    case "hotel":
      return (data as Hotel).name;
    default:
      return null;
  }
}

function getOfferTimeTokens(
  resourceType: TravelResourceType,
  data: TravelOffer,
): string[] {
  switch (resourceType) {
    case "bus":
    case "train": {
      const item = data as Bus | Train;
      return [item.departureTime, item.arrivalTime];
    }
    case "flight": {
      const item = data as Flight;
      return [item.departureTime, item.arrivalTime];
    }
    case "cab": {
      const item = data as Cab;
      return [item.departureTime];
    }
    case "hotel": {
      const item = data as Hotel;
      return [item.checkInTime, item.checkOutTime];
    }
    default:
      return [];
  }
}

function labelDuplicatesOffer(
  label: string,
  resourceType: TravelResourceType,
  data: TravelOffer,
): boolean {
  const primary = getOfferPrimaryTitle(resourceType, data);
  if (!primary) {
    return false;
  }

  return normalizeText(label) === normalizeText(primary);
}

function timeDuplicatesOffer(
  stepTime: string | undefined,
  resourceType: TravelResourceType,
  data: TravelOffer,
): boolean {
  if (!stepTime) {
    return false;
  }

  const normalizedStepTime = normalizeText(stepTime);
  const tokens = getOfferTimeTokens(resourceType, data);

  return tokens.some(
    (token) => token && normalizedStepTime.includes(normalizeText(token)),
  );
}

export function resolveTimelineHeaderForOffer(input: {
  dayLabel: string;
  label: string;
  stepTime?: string;
  note?: string;
  hideDayLabel?: boolean;
  resourceType: TravelResourceType;
  data: TravelOffer;
}): {
  dayLabel?: string;
  label?: string;
  time?: string;
  note?: string;
} {
  const hideLabel = labelDuplicatesOffer(
    input.label,
    input.resourceType,
    input.data,
  );

  return {
    dayLabel: input.hideDayLabel ? undefined : input.dayLabel,
    label: hideLabel ? undefined : input.label,
    time:
      hideLabel || timeDuplicatesOffer(input.stepTime, input.resourceType, input.data)
        ? undefined
        : input.stepTime,
    note: input.note,
  };
}
