"use client";


import { Fragment, type ReactNode } from "react";

import { toContentItemArray } from "@repo/types";
import { Box } from "@repo/ui/box";
import { ContentBlockGroup } from "@repo/ui/content-block-group";

import {
  normalizeContentItem,
  unwrapLayoutRoot,
} from "./normalize-content-item";
import { getWidgetRegistry } from "./registry";
import type { ContentChildren, ContentItem } from "./types";
import { WidgetRenderBoundary } from "./widget-render-boundary";

const TIMELINE_WIDGETS = new Set([
  "travel-recommendation",
  "travel-offer",
  "plan-choice",
  "content-block",
  "widget-error",
]);

const HEADER_TO_GROUP_GAP = 20;
const SECTION_GAP = 24;

type LayoutSegment =
  | { type: "item"; item: ContentItem; stepIndex: number }
  | { type: "content-block-group"; items: ContentItem[]; stepIndex: number };

function renderContentItem(
  item: ContentItem,
  timelineMeta?: { isLastStep?: boolean; hideDayLabel?: boolean },
): ReactNode {
  const normalized = normalizeContentItem(item);
  const Widget = getWidgetRegistry()[normalized.key];

  if (!Widget) {
    return null;
  }

  const slotProps = renderSlotChildren(normalized.children, timelineMeta);

  return (
    <WidgetRenderBoundary widgetKey={normalized.key}>
      <Widget
        {...normalized.props}
        {...slotProps}
        {...(timelineMeta ?? {})}
      />
    </WidgetRenderBoundary>
  );
}

function renderSlotChildren(
  children: ContentChildren | null,
  timelineMeta?: { isLastStep?: boolean; hideDayLabel?: boolean },
): Record<string, ReactNode> {
  if (!children) {
    return {};
  }

  const slots: Record<string, ReactNode> = {};

  for (const [slotName, items] of Object.entries(children)) {
    slots[slotName] = renderContentItems(items, timelineMeta);
  }

  return slots;
}

function renderContentItems(
  items: ContentItem[] | ContentItem | null | undefined,
  timelineMeta?: { isLastStep?: boolean; hideDayLabel?: boolean },
): ReactNode {
  const normalizedItems = toContentItemArray(items);

  if (normalizedItems.length === 0) {
    return null;
  }

  const filtered = normalizedItems.filter(
    (item): item is ContentItem => item != null && typeof item.key === "string",
  );

  return filtered.map((item, index) => (
    <Fragment key={`${item.key}-${index}`}>
      {renderContentItem(item, {
        ...timelineMeta,
        isLastStep: timelineMeta?.isLastStep ?? index === filtered.length - 1,
      })}
    </Fragment>
  ));
}

function getContentBlockProps(item: ContentItem): {
  heading?: string;
  content: string;
} {
  const props = item.props ?? {};

  return {
    heading: typeof props.heading === "string" ? props.heading : undefined,
    content: typeof props.content === "string" ? props.content : "",
  };
}

function segmentLayoutSteps(steps: ContentItem[]): LayoutSegment[] {
  const segments: LayoutSegment[] = [];
  let index = 0;

  while (index < steps.length) {
    const item = steps[index]!;

    if (item.key === "content-block") {
      const group: ContentItem[] = [];

      while (index < steps.length && steps[index]?.key === "content-block") {
        group.push(steps[index]!);
        index += 1;
      }

      segments.push({
        type: "content-block-group",
        items: group,
        stepIndex: index - group.length,
      });
      continue;
    }

    segments.push({ type: "item", item, stepIndex: index });
    index += 1;
  }

  return segments;
}

function renderTripLayout(items: ContentItem[]): ReactNode {
  const filtered = items.filter(
    (item): item is ContentItem => item != null && typeof item.key === "string",
  );

  const header = filtered.find((item) => item.key === "trip-header") ?? null;
  const steps = filtered.filter((item) => item.key !== "trip-header");
  const segments = segmentLayoutSteps(steps);

  const stepSegments = segments.map((segment, segmentIndex) => {
    const isMultiBlockGroup =
      segment.type === "content-block-group" && segment.items.length > 1;
    const isFirst = segmentIndex === 0;
    const marginTop = isFirst
      ? header
        ? isMultiBlockGroup
          ? HEADER_TO_GROUP_GAP
          : SECTION_GAP
        : 0
      : SECTION_GAP;
    const marginClass = isFirst && header ? "lg:mt-0" : undefined;

    const segmentBox = (key: string, content: ReactNode) => (
      <Box key={key} className={marginClass} style={{ marginTop }}>
        {content}
      </Box>
    );

    if (segment.type === "content-block-group") {
      if (segment.items.length === 1) {
        const item = segment.items[0]!;
        const isLastStep = segmentIndex === segments.length - 1;

        return segmentBox(
          `content-block-${segment.stepIndex}`,
          renderContentItem(item, { isLastStep }),
        );
      }

      return segmentBox(
        `content-block-group-${segment.stepIndex}`,
        <ContentBlockGroup
          items={segment.items.map((item) => getContentBlockProps(item))}
        />,
      );
    }

    const item = segment.item;
    const isLastStep = segmentIndex === segments.length - 1;

    return segmentBox(
      `${item.key}-${segment.stepIndex}`,
      renderContentItem(item, { isLastStep }),
    );
  });

  if (!header) {
    return (
      <Box style={{ flexDirection: "column", width: "100%" }}>
        {stepSegments}
      </Box>
    );
  }

  return (
    <Box
      className="flex w-full flex-col lg:grid lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:items-start lg:gap-x-12"
      style={{ flexDirection: "column", width: "100%" }}
    >
      <Box className="lg:sticky lg:top-8 lg:self-start">
        {renderContentItem(header)}
      </Box>
      <Box className="min-w-0" style={{ flexDirection: "column", width: "100%" }}>
        {stepSegments}
      </Box>
    </Box>
  );
}

export function ContentRenderer({
  content,
}: {
  content: ContentItem | ContentItem[];
}) {
  const unwrapped = unwrapLayoutRoot(content);

  if (Array.isArray(unwrapped)) {
    return renderTripLayout(unwrapped);
  }

  if (unwrapped.key === "trip-header" || !TIMELINE_WIDGETS.has(unwrapped.key)) {
    return renderContentItem(unwrapped, { isLastStep: true });
  }

  return renderContentItem(unwrapped, { isLastStep: true });
}

export { renderContentItem };
