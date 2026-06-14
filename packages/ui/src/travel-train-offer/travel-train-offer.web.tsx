import { TravelOfferLayout } from "../travel-offer-layout/travel-offer-layout.web";
import type { TravelTrainOfferProps } from "./travel-train-offer.types";

export type { TravelTrainOfferProps } from "./travel-train-offer.types";

function formatPrice(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function TravelTrainOffer({
  train,
  type = "train",
  highlight,
  className,
  style,
}: TravelTrainOfferProps) {
  return (
    <TravelOfferLayout
      type={type}
      highlight={highlight}
      className={className}
      style={style}
      tag={{ label: train.travelClass, tone: "stone" }}
      header={
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[20px] font-semibold text-stone-900">{train.name}</span>
          <span className="text-[14px] text-stone-500">
            {train.trainNumber} · {train.from} → {train.to}
          </span>
        </div>
      }
      footer={
        <div className="flex items-baseline justify-between gap-3 border-t border-stone-200 pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] text-stone-700">
              {train.departureTime} – {train.arrivalTime}
            </span>
            <span className="text-[13px] text-stone-400">{train.dayLabel}</span>
          </div>
          <span className="text-[17px] font-semibold text-stone-900">
            {formatPrice(train.priceInr)}
          </span>
        </div>
      }
    />
  );
}
