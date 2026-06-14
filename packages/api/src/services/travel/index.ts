import type {
  Bus,
  BusSearchParams,
  Cab,
  CabSearchParams,
  Flight,
  FlightSearchParams,
  Hotel,
  HotelSearchParams,
  Train,
  TrainSearchParams,
  TravelResourceType,
  UserPersonalization,
} from "@repo/types";

import { mockBuses } from "../../data/buses";
import { mockCabs } from "../../data/cabs";
import { mockFlights } from "../../data/flights";
import { mockHotels } from "../../data/hotels";
import { mockPersonalization } from "../../data/personalization";
import { mockTrains } from "../../data/trains";
import {
  cityMatches,
  getBudgetMaxPrice,
  matchesTimeWindow,
} from "./utils";

export function searchFlights(params: FlightSearchParams): Flight[] {
  return mockFlights.filter(
    (flight) =>
      cityMatches(flight.from, params.from) &&
      cityMatches(flight.to, params.to) &&
      matchesTimeWindow(
        flight.departureTime,
        params.afterTime,
        params.beforeTime,
      ),
  );
}

export function getFlightById(id: string): Flight | null {
  return mockFlights.find((flight) => flight.id === id) ?? null;
}

export function searchBuses(params: BusSearchParams): Bus[] {
  return mockBuses.filter((bus) => {
    if (!cityMatches(bus.from, params.from) || !cityMatches(bus.to, params.to)) {
      return false;
    }

    if (params.overnight === true && !bus.overnight) {
      return false;
    }

    if (params.afterTime && !matchesTimeWindow(bus.departureTime, params.afterTime)) {
      return false;
    }

    return true;
  });
}

export function getBusById(id: string): Bus | null {
  return mockBuses.find((bus) => bus.id === id) ?? null;
}

export function searchTrains(params: TrainSearchParams): Train[] {
  return mockTrains.filter(
    (train) =>
      cityMatches(train.from, params.from) &&
      cityMatches(train.to, params.to) &&
      matchesTimeWindow(train.departureTime, params.afterTime),
  );
}

export function getTrainById(id: string): Train | null {
  return mockTrains.find((train) => train.id === id) ?? null;
}

export function searchCabs(params: CabSearchParams): Cab[] {
  return mockCabs.filter(
    (cab) =>
      cityMatches(cab.from, params.from) &&
      cityMatches(cab.to, params.to) &&
      matchesTimeWindow(cab.departureTime, params.afterTime),
  );
}

export function getCabById(id: string): Cab | null {
  return mockCabs.find((cab) => cab.id === id) ?? null;
}

export function getUserPersonalization(): UserPersonalization {
  return mockPersonalization;
}

export function searchHotels(params: HotelSearchParams): Hotel[] {
  const personalization = getUserPersonalization();
  const preferredType = params.applyPersonalization
    ? personalization.preferredAccommodationType
    : params.type;
  const maxPrice = params.applyPersonalization
    ? getBudgetMaxPrice(personalization.budgetTier)
    : undefined;

  return mockHotels.filter((hotel) => {
    if (!cityMatches(hotel.location, params.location)) {
      return false;
    }

    if (preferredType && hotel.type !== preferredType) {
      return false;
    }

    if (maxPrice !== undefined && hotel.pricePerNightInr > maxPrice) {
      return false;
    }

    return true;
  });
}

export function getHotelById(id: string): Hotel | null {
  return mockHotels.find((hotel) => hotel.id === id) ?? null;
}

export function getTravelResourceById(
  type: TravelResourceType,
  id: string,
): Flight | Bus | Train | Cab | Hotel | null {
  switch (type) {
    case "flight":
      return getFlightById(id);
    case "bus":
      return getBusById(id);
    case "train":
      return getTrainById(id);
    case "cab":
      return getCabById(id);
    case "hotel":
      return getHotelById(id);
    default:
      return null;
  }
}
