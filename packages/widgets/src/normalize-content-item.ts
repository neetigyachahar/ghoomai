import type { ContentChildren, ContentItem } from "./types";

const REGISTRY_WIDGET_KEYS = new Set([
  "demo-section",
  "demo-action",
  "travel-offer",
]);

export function inferWidgetKey(item: ContentItem): string {
  if (REGISTRY_WIDGET_KEYS.has(item.key)) {
    return item.key;
  }

  const { props } = item;

  if (
    typeof props.resourceType === "string" &&
    typeof props.resourceId === "string"
  ) {
    return "travel-offer";
  }

  if (typeof props.title === "string") {
    return "demo-section";
  }

  if (typeof props.label === "string") {
    return "demo-action";
  }

  return item.key;
}

function normalizeContentChildren(
  children: ContentChildren | null,
  widgetKey: string,
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

    const targetSlot =
      slotName === "content" && widgetKey === "demo-section"
        ? "children"
        : slotName;

    normalized[targetSlot] = items.map(normalizeContentItem);
  }

  return normalized;
}

export function normalizeContentItem(item: ContentItem): ContentItem {
  const widgetKey = inferWidgetKey(item);

  return {
    key: widgetKey,
    props: item.props,
    children: normalizeContentChildren(item.children, widgetKey),
  };
}

export function unwrapLayoutRoot(
  item: ContentItem,
): ContentItem | ContentItem[] {
  const widgetKey = inferWidgetKey(item);

  if (REGISTRY_WIDGET_KEYS.has(widgetKey)) {
    return normalizeContentItem(item);
  }

  if (item.children) {
    const slotItems =
      item.children.content ??
      item.children.children ??
      Object.values(item.children).find(Array.isArray);

    if (Array.isArray(slotItems) && slotItems.length > 0) {
      return slotItems.map(normalizeContentItem);
    }
  }

  return normalizeContentItem(item);
}
