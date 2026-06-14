"use client";


import { Fragment, type ReactNode } from "react";

import {
  normalizeContentItem,
  unwrapLayoutRoot,
} from "./normalize-content-item";
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
  const normalized = normalizeContentItem(item);
  const Widget = getWidgetRegistry()[normalized.key];

  if (!Widget) {
    console.warn(
      `Unknown widget: ${item.key} (resolved as ${normalized.key})`,
    );
    return null;
  }

  const slotProps = renderSlotChildren(normalized.children);

  return <Widget {...normalized.props} {...slotProps} />;
}

export function ContentRenderer({ content }: { content: ContentItem }) {
  const unwrapped = unwrapLayoutRoot(content);

  if (Array.isArray(unwrapped)) {
    return renderContentItems(unwrapped);
  }

  return renderContentItem(unwrapped);
}
