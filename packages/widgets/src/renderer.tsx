"use client";


import { Fragment, type ReactNode } from "react";

import { getWidgetRegistry } from "./registry";
import type { ContentChildren, ContentItem } from "./types";

function renderContentItems(
  items: ContentItem[] | null | undefined,
): ReactNode {
  if (!items) {
    return null;
  }

  return items.map((item, index) => (
    <Fragment key={`${item.key}-${index}`}>
      {renderContentItem(item)}
    </Fragment>
  ));
}

function renderSlotChildren(
  children: ContentChildren | null,
): Record<string, ReactNode> {
  if (!children) {
    return {};
  }

  const slots: Record<string, ReactNode> = {};

  for (const [slotName, items] of Object.entries(children)) {
    slots[slotName] = renderContentItems(items);
  }

  return slots;
}

export function renderContentItem(item: ContentItem): ReactNode {
  const Widget = getWidgetRegistry()[item.key];

  if (!Widget) {
    console.warn(`Unknown widget: ${item.key}`);
    return null;
  }

  const slotProps = renderSlotChildren(item.children);

  return <Widget {...item.props} {...slotProps} />;
}

export function ContentRenderer({ content }: { content: ContentItem }) {
  return renderContentItem(content);
}
