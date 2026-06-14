"use client";

import type { ViewStyle } from "react-native";

import { useTravelResource } from "@repo/hooks/travel";
import type {
  Bus,
  Cab,
  CabDetails,
  Flight,
  Hotel,
  Train,
  TravelResourceType,
} from "@repo/types";
import { Text } from "@repo/ui/text";
import { TimelineStep } from "@repo/ui/timeline-step";
import { TravelBusOffer } from "@repo/ui/travel-bus-offer";
import { TravelCabOffer } from "@repo/ui/travel-cab-offer";
import { TravelFlightOffer } from "@repo/ui/travel-flight-offer";
import { TravelHotelOffer } from "@repo/ui/travel-hotel-offer";
import { TravelOfferCard } from "@repo/ui/travel-offer-card";
import { TravelTrainOffer } from "@repo/ui/travel-train-offer";

import {
  buildLocalCab,
  isLocalCabResource,
} from "../utils/build-local-cab";
import { resolveTimelineHeaderForOffer } from "../utils/resolve-timeline-header";

const DEFAULT_LABELS: Record<TravelResourceType, string> = {
  flight: "Flight",
  bus: "Getting there",
  train: "Train",
  cab: "Local ride",
  hotel: "Check in",
};

export interface TravelRecommendationWidgetProps {
  resourceType: TravelResourceType;
  resourceId: string;
  dayLabel: string;
  sectionTitle?: string;
  stepTime?: string;
  sectionDescription?: string;
  highlight?: string;
  cabDetails?: CabDetails;
  isLastStep?: boolean;
  hideDayLabel?: boolean;
}

function ResourceOffer({
  resourceType,
  data,
}: {
  resourceType: TravelResourceType;
  data: Flight | Bus | Train | Cab | Hotel;
}) {
  switch (resourceType) {
    case "flight":
      return <TravelFlightOffer flight={data as Flight} />;
    case "bus":
      return <TravelBusOffer bus={data as Bus} />;
    case "train":
      return <TravelTrainOffer train={data as Train} />;
    case "cab":
      return <TravelCabOffer cab={data as Cab} />;
    case "hotel":
      return <TravelHotelOffer hotel={data as Hotel} />;
    default:
      return null;
  }
}

function OfferCard({
  resourceType,
  data,
}: {
  resourceType: TravelResourceType;
  data: Flight | Bus | Train | Cab | Hotel;
}) {
  return (
    <TravelOfferCard>
      <ResourceOffer resourceType={resourceType} data={data} />
    </TravelOfferCard>
  );
}

export function TravelRecommendationWidget(
  props: TravelRecommendationWidgetProps,
) {
  const {
    resourceType,
    resourceId,
    dayLabel,
    sectionTitle,
    stepTime,
    sectionDescription,
    highlight,
    cabDetails,
    isLastStep,
    hideDayLabel,
  } = props;

  const label =
    sectionTitle ?? DEFAULT_LABELS[resourceType] ?? "Recommendation";
  const note = sectionDescription ?? highlight;

  if (!resourceType || !resourceId) {
    return (
      <TimelineStep
        dayLabel={hideDayLabel ? undefined : dayLabel}
        label={label}
        time={stepTime}
        note={note}
        isLast={isLastStep}
      >
        <Text>Missing resourceType or resourceId.</Text>
      </TimelineStep>
    );
  }

  const useInlineCab =
    resourceType === "cab" && isLocalCabResource(resourceId);

  if (useInlineCab) {
    const cab = buildLocalCab({
      cabDetails,
      sectionTitle: label,
      stepTime,
      resourceId,
    });

    const cabHeader = resolveTimelineHeaderForOffer({
      dayLabel,
      label,
      stepTime,
      note,
      hideDayLabel,
      resourceType: "cab",
      data: cab,
    });

    return (
      <TimelineStep
        dayLabel={cabHeader.dayLabel}
        label={cabHeader.label}
        time={cabHeader.time}
        note={cabHeader.note}
        isLast={isLastStep}
      >
        <OfferCard resourceType="cab" data={cab} />
      </TimelineStep>
    );
  }

  return (
    <TravelRecommendationWidgetInner
      resourceType={resourceType}
      resourceId={resourceId}
      dayLabel={dayLabel}
      label={label}
      stepTime={stepTime}
      note={note}
      cabDetails={cabDetails}
      isLastStep={isLastStep}
      hideDayLabel={hideDayLabel}
    />
  );
}

function TravelRecommendationWidgetInner({
  resourceType,
  resourceId,
  dayLabel,
  label,
  stepTime,
  note,
  cabDetails,
  isLastStep,
  hideDayLabel,
}: {
  resourceType: TravelResourceType;
  resourceId: string;
  dayLabel: string;
  label: string;
  stepTime?: string;
  note?: string;
  cabDetails?: CabDetails;
  isLastStep?: boolean;
  hideDayLabel?: boolean;
}) {
  const { data, isLoading, error } = useTravelResource(
    resourceType,
    resourceId,
  );

  const cabFallback =
    resourceType === "cab" && error
      ? buildLocalCab({
          cabDetails,
          sectionTitle: label,
          stepTime,
          resourceId,
        })
      : null;

  const resolvedData = data ?? cabFallback;

  const timelineHeader = resolvedData
    ? resolveTimelineHeaderForOffer({
        dayLabel,
        label,
        stepTime,
        note,
        hideDayLabel,
        resourceType,
        data: resolvedData,
      })
    : {
        dayLabel: hideDayLabel ? undefined : dayLabel,
        note,
      };

  return (
    <TimelineStep
      dayLabel={timelineHeader.dayLabel}
      label={timelineHeader.label}
      time={timelineHeader.time}
      note={timelineHeader.note}
      isLast={isLastStep}
    >
      {isLoading ? <Text>Loading…</Text> : null}
      {error && !cabFallback ? <Text>{error}</Text> : null}
      {!isLoading && resolvedData ? (
        <OfferCard resourceType={resourceType} data={resolvedData} />
      ) : null}
    </TimelineStep>
  );
}

export const TravelOfferWidget = TravelRecommendationWidget;
