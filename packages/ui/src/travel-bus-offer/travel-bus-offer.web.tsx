import { TravelOfferLayout } from "../travel-offer-layout/travel-offer-layout.web";
import type { TravelBusOfferProps } from "./travel-bus-offer.types";

export type { TravelBusOfferProps } from "./travel-bus-offer.types";

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function TravelBusOffer({
  bus,
  type = "bus",
  highlight,
  className,
  style,
}: TravelBusOfferProps) {
  return (
    <TravelOfferLayout
      type={type}
      highlight={highlight}
      className={className}
      style={style}
      tag={bus.overnight ? { label: "Overnight", tone: "teal" } : undefined}
      header={
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[20px] font-semibold text-stone-900">
            {bus.operator}
          </span>
          <span className="text-[14px] text-stone-500">
            {bus.from} → {bus.to} · {bus.dayLabel}
          </span>
        </div>
      }
      footer={
        <div className="flex items-baseline justify-between gap-3 border-t border-stone-200 pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] text-stone-700">
              {bus.departureTime} – {bus.arrivalTime}
            </span>
            <span className="text-[13px] text-stone-400">Direct service</span>
          </div>
          <span className="text-[17px] font-semibold text-stone-900">
            {formatPrice(bus.priceInr)}
          </span>
        </div>
      }
    />
  );
}
