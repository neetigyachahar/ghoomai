import { TravelOfferLayout } from "../travel-offer-layout/travel-offer-layout.web";
import type { TravelFlightOfferProps } from "./travel-flight-offer.types";

export type { TravelFlightOfferProps } from "./travel-flight-offer.types";

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function TravelFlightOffer({
  flight,
  type = "flight",
  highlight,
  className,
  style,
}: TravelFlightOfferProps) {
  return (
    <TravelOfferLayout
      type={type}
      highlight={highlight}
      className={className}
      style={style}
      header={
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[28px] font-semibold tracking-tight text-stone-900">
              {flight.departureTime}
            </span>
            <span className="truncate text-[14px] text-stone-500">{flight.from}</span>
          </div>
          <div className="flex min-w-[80px] flex-col items-center gap-1 px-2">
            <span className="text-[12px] font-medium text-teal-700">
              {formatDuration(flight.durationMinutes)}
            </span>
            <div className="relative h-px w-full bg-stone-200">
              <div className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-teal-700" />
              <div className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-teal-700" />
            </div>
          </div>
          <div className="flex min-w-0 flex-col items-end gap-0.5">
            <span className="text-[28px] font-semibold tracking-tight text-stone-900">
              {flight.arrivalTime}
            </span>
            <span className="truncate text-[14px] text-stone-500">{flight.to}</span>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between gap-3 border-t border-stone-200 pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-medium text-stone-900">{flight.airline}</span>
            <span className="text-[13px] text-stone-500">
              {flight.flightNumber} · {flight.dayLabel}
            </span>
          </div>
          <span className="text-[17px] font-semibold text-stone-900">
            {formatPrice(flight.priceInr)}
          </span>
        </div>
      }
    />
  );
}
