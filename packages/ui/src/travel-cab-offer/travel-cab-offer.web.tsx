import { TravelOfferLayout } from "../travel-offer-layout/travel-offer-layout.web";
import type { TravelCabOfferProps } from "./travel-cab-offer.types";

export type { TravelCabOfferProps } from "./travel-cab-offer.types";

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min ride`;
  if (mins === 0) return `${hours} hr ride`;
  return `${hours} hr ${mins} min ride`;
}

export function TravelCabOffer({
  cab,
  type = "cab",
  highlight,
  className,
  style,
}: TravelCabOfferProps) {
  return (
    <TravelOfferLayout
      type={type}
      highlight={highlight}
      className={className}
      style={style}
      tag={{ label: cab.vehicleType, tone: "orange" }}
      header={
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[20px] font-semibold text-stone-900">
            {cab.provider}
          </span>
          <span className="text-[14px] text-stone-500">
            {cab.from} → {cab.to}
          </span>
        </div>
      }
      footer={
        <div className="flex items-baseline justify-between gap-3 border-t border-stone-200 pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] text-stone-700">
              Departs {cab.departureTime} · {cab.dayLabel}
            </span>
            <span className="text-[13px] text-stone-400">
              {formatDuration(cab.durationMinutes)}
            </span>
          </div>
          <span className="text-[17px] font-semibold text-stone-900">
            {formatPrice(cab.priceInr)}
          </span>
        </div>
      }
    />
  );
}
