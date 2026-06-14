export type TravelResourceType = "flight" | "bus" | "train" | "cab" | "hotel";

export type AccommodationType = "hotel" | "homestay" | "resort";

export type BudgetTier = "budget" | "mid" | "premium";

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  dayLabel: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  priceInr: number;
}

export interface Bus {
  id: string;
  operator: string;
  from: string;
  to: string;
  dayLabel: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  overnight: boolean;
  priceInr: number;
}

export interface Train {
  id: string;
  name: string;
  trainNumber: string;
  from: string;
  to: string;
  dayLabel: string;
  departureTime: string;
  arrivalTime: string;
  travelClass: string;
  durationMinutes: number;
  priceInr: number;
}

export interface Cab {
  id: string;
  provider: string;
  from: string;
  to: string;
  vehicleType: string;
  dayLabel: string;
  departureTime: string;
  durationMinutes: number;
  priceInr: number;
}

export interface Hotel {
  id: string;
  name: string;
  type: AccommodationType;
  location: string;
  checkInTime: string;
  checkOutTime: string;
  pricePerNightInr: number;
  rating: number;
}

export interface UserPersonalization {
  userId: string;
  preferredAccommodationType: AccommodationType;
  budgetTier: BudgetTier;
  notes: string;
}

export interface FlightSearchParams {
  from: string;
  to: string;
  afterTime?: string;
  beforeTime?: string;
}

export interface BusSearchParams {
  from: string;
  to: string;
  overnight?: boolean;
  afterTime?: string;
}

export interface TrainSearchParams {
  from: string;
  to: string;
  afterTime?: string;
}

export interface CabSearchParams {
  from: string;
  to: string;
  afterTime?: string;
}

export interface HotelSearchParams {
  location: string;
  type?: AccommodationType;
  applyPersonalization?: boolean;
}

export type TravelResource =
  | Flight
  | Bus
  | Train
  | Cab
  | Hotel;
