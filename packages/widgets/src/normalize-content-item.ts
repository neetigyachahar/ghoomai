import { toContentItemArray } from "@repo/types";

import type { ContentChildren, ContentItem } from "./types";

import { getWidgetRegistry } from "./registry";

function getRegistryWidgetKeys(): Set<string> {
  return new Set(Object.keys(getWidgetRegistry()));
}

function isContentItem(value: unknown): value is ContentItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "key" in value &&
    typeof (value as ContentItem).key === "string"
  );
}

function normalizeContentChildren(
  children: ContentChildren | null,
): ContentChildren | null {
  if (!children) {
    return null;
  }

  const normalized: ContentChildren = {};

  for (const [slotName, items] of Object.entries(children)) {
    if (!items) {
      normalized[slotName] = items;
      continue;
    }

    normalized[slotName] = toContentItemArray(items)
      .filter(isContentItem)
      .map(normalizeContentItem);
  }

  return normalized;
}

export function normalizeContentItem(item: ContentItem): ContentItem {
  const registryKeys = getRegistryWidgetKeys();

  if (!registryKeys.has(item.key)) {
    console.warn(`Unknown widget key: ${item.key}`);
  }

  return {
    key: item.key,
    props: item.props ?? {},
    children: normalizeContentChildren(item.children),
  };
}

export function unwrapLayoutRoot(
  layout: ContentItem | ContentItem[],
): ContentItem | ContentItem[] {
  if (Array.isArray(layout)) {
    return layout.filter(isContentItem).map(normalizeContentItem);
  }

  return normalizeContentItem(layout);
}
