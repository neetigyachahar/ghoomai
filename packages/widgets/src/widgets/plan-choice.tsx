"use client";

import { useState, type ReactNode } from "react";
import type { ViewStyle } from "react-native";

import { Box } from "@repo/ui/box";
import { OrDivider } from "@repo/ui/or-divider";
import { PlanOption } from "@repo/ui/plan-option";
import { TimelineStep } from "@repo/ui/timeline-step";

export interface PlanChoiceOption {
  id: string;
  label: string;
  summary?: string;
}

export interface PlanChoiceWidgetProps {
  title: string;
  dayLabel: string;
  description?: string;
  stepLabel?: string;
  stepTime?: string;
  options: PlanChoiceOption[];
  isLastStep?: boolean;
  hideDayLabel?: boolean;
  [slotId: string]: unknown;
}

const optionsStyle: ViewStyle = {
  flexDirection: "column",
  gap: 8,
};

function isPlanChoiceOption(value: unknown): value is PlanChoiceOption {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "label" in value &&
    typeof (value as PlanChoiceOption).id === "string" &&
    typeof (value as PlanChoiceOption).label === "string"
  );
}

export function PlanChoiceWidget(props: PlanChoiceWidgetProps) {
  const {
    title,
    dayLabel,
    description,
    stepLabel,
    stepTime,
    options,
    isLastStep,
    hideDayLabel,
    ...slotProps
  } = props;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const normalizedOptions = Array.isArray(options)
    ? options.filter(isPlanChoiceOption)
    : [];

  const label = stepLabel ?? title;

  if (selectedId) {
    const slotContent = slotProps[selectedId] as ReactNode | undefined;
    return slotContent ? <>{slotContent}</> : null;
  }

  return (
    <TimelineStep
      dayLabel={hideDayLabel ? undefined : dayLabel}
      label={label}
      time={stepTime}
      note={description}
      isLast={isLastStep}
    >
      <Box style={optionsStyle}>
        {normalizedOptions.map((option, index) => (
          <Box key={option.id} style={{ flexDirection: "column", gap: 8 }}>
            {index > 0 ? <OrDivider /> : null}
            <PlanOption
              label={option.label}
              summary={option.summary}
              onPress={() => setSelectedId(option.id)}
            />
          </Box>
        ))}
      </Box>
    </TimelineStep>
  );
}
