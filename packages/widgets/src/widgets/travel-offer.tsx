import type { ViewStyle } from "react-native";

import { useTravelResource } from "@repo/hooks/travel";
import type {
  Bus,
  Cab,
  Flight,
  Hotel,
  Train,
  TravelResourceType,
} from "@repo/types";
import { Box } from "@repo/ui/box";
import { Text } from "@repo/ui/text";

export interface TravelOfferWidgetProps {
  resourceType: TravelResourceType;
  resourceId: string;
}

const cardStyle: ViewStyle = {
  flexDirection: "column",
  gap: 4,
  padding: 12,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#e4e4e7",
  backgroundColor: "#fafafa",
};

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function FlightDetails({ flight }: { flight: Flight }) {
  return (
    <>
      <Text variant="title">
        {flight.airline} {flight.flightNumber}
      </Text>
      <Text>
        {flight.from} → {flight.to} · {flight.dayLabel}
      </Text>
      <Text>
        {flight.departureTime} – {flight.arrivalTime} ·{" "}
        {formatPrice(flight.priceInr)}
      </Text>
    </>
  );
}

function BusDetails({ bus }: { bus: Bus }) {
  return (
    <>
      <Text variant="title">{bus.operator}</Text>
      <Text>
        {bus.from} → {bus.to} · {bus.dayLabel}
        {bus.overnight ? " · Overnight" : ""}
      </Text>
      <Text>
        {bus.departureTime} – {bus.arrivalTime} · {formatPrice(bus.priceInr)}
      </Text>
    </>
  );
}

function TrainDetails({ train }: { train: Train }) {
  return (
    <>
      <Text variant="title">{train.name}</Text>
      <Text>
        {train.from} → {train.to} · {train.travelClass}
      </Text>
      <Text>
        {train.departureTime} – {train.arrivalTime} ·{" "}
        {formatPrice(train.priceInr)}
      </Text>
    </>
  );
}

function CabDetails({ cab }: { cab: Cab }) {
  return (
    <>
      <Text variant="title">
        {cab.provider} · {cab.vehicleType}
      </Text>
      <Text>
        {cab.from} → {cab.to} · {cab.dayLabel}
      </Text>
      <Text>
        Departs {cab.departureTime} · {formatPrice(cab.priceInr)}
      </Text>
    </>
  );
}

function HotelDetails({ hotel }: { hotel: Hotel }) {
  return (
    <>
      <Text variant="title">{hotel.name}</Text>
      <Text>
        {hotel.location} · {hotel.type} · ★ {hotel.rating}
      </Text>
      <Text>
        Check-in {hotel.checkInTime} · {formatPrice(hotel.pricePerNightInr)}
        /night
      </Text>
    </>
  );
}

function ResourceDetails({
  resourceType,
  data,
}: {
  resourceType: TravelResourceType;
  data: Flight | Bus | Train | Cab | Hotel;
}) {
  switch (resourceType) {
    case "flight":
      return <FlightDetails flight={data as Flight} />;
    case "bus":
      return <BusDetails bus={data as Bus} />;
    case "train":
      return <TrainDetails train={data as Train} />;
    case "cab":
      return <CabDetails cab={data as Cab} />;
    case "hotel":
      return <HotelDetails hotel={data as Hotel} />;
    default:
      return null;
  }
}

export function TravelOfferWidget({
  resourceType,
  resourceId,
}: TravelOfferWidgetProps) {
  const { data, isLoading, error } = useTravelResource(
    resourceType,
    resourceId,
  );

  return (
    <Box
      className="flex flex-col gap-1 rounded-[10px] border border-zinc-200 bg-zinc-50 p-3"
      style={cardStyle}
    >
      {isLoading ? <Text>Loading offer…</Text> : null}
      {error ? <Text>{error}</Text> : null}
      {!isLoading && !error && data ? (
        <ResourceDetails resourceType={resourceType} data={data} />
      ) : null}
    </Box>
  );
}
