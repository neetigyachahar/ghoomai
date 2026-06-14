import type { Cab, CabDetails } from "@repo/types";

const LOCAL_CAB_ID = "local-cab";

function parseDepartureTime(stepTime?: string): string | undefined {
  if (!stepTime) {
    return undefined;
  }

  const match = stepTime.match(/\b(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
  return match?.[1];
}

export function buildLocalCab(input: {
  cabDetails?: CabDetails;
  sectionTitle?: string;
  stepTime?: string;
  resourceId?: string;
}): Cab {
  const { cabDetails, sectionTitle, stepTime, resourceId } = input;
  const destination = cabDetails?.to ?? sectionTitle ?? "Destination";
  const origin = cabDetails?.from ?? "Local area";

  return {
    id: resourceId ?? LOCAL_CAB_ID,
    provider: cabDetails?.provider ?? "Local taxi",
    from: origin,
    to: destination,
    vehicleType: cabDetails?.vehicleType ?? "Sedan",
    dayLabel: cabDetails?.dayLabel ?? "Daily",
    departureTime:
      cabDetails?.departureTime ?? parseDepartureTime(stepTime) ?? "09:00",
    durationMinutes: cabDetails?.durationMinutes ?? 45,
    priceInr: cabDetails?.priceInr ?? 600,
  };
}

export function isLocalCabResource(resourceId: string): boolean {
  return resourceId === LOCAL_CAB_ID;
}
