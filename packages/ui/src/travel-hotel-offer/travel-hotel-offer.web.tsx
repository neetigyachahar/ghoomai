import type { Hotel } from "@repo/types";

import { TravelOfferLayout } from "../travel-offer-layout/travel-offer-layout.web";
import type { TravelHotelOfferProps } from "./travel-hotel-offer.types";

export type { TravelHotelOfferProps } from "./travel-hotel-offer.types";

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatAccommodationType(type: Hotel["type"]) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function TravelHotelOffer({
  hotel,
  type = "hotel",
  highlight,
  className,
  style,
}: TravelHotelOfferProps) {
  return (
    <TravelOfferLayout
      type={type}
      highlight={highlight}
      className={className}
      style={style}
      tag={{ label: formatAccommodationType(hotel.type), tone: "stone" }}
      header={
        <div className="flex flex-col gap-1.5">
          <span className="text-[20px] font-semibold leading-snug text-stone-900">
            {hotel.name}
          </span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-stone-500">
            <span className="font-medium text-stone-700">★ {hotel.rating}</span>
            <span aria-hidden>·</span>
            <span>{hotel.location}</span>
          </div>
        </div>
      }
      footer={
        <div className="flex items-baseline justify-between gap-3 border-t border-stone-200 pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] text-stone-700">
              Check-in {hotel.checkInTime} · Check-out {hotel.checkOutTime}
            </span>
            <span className="text-[13px] text-stone-400">Per night</span>
          </div>
          <span className="text-[17px] font-semibold text-stone-900">
            {formatPrice(hotel.pricePerNightInr)}
          </span>
        </div>
      }
    />
  );
}
