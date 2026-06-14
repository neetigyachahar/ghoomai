export interface ContentItem {
  key: string;
  props: Record<string, unknown>;
  children: ContentChildren | null;
}

export type ContentChildren = {
  [slot: string]: ContentItem[] | ContentItem | null | undefined;
};

function isContentItem(value: unknown): value is ContentItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "key" in value &&
    typeof (value as ContentItem).key === "string"
  );
}

/** Slot children may be a single item or an array — normalize to an array. */
export function toContentItemArray(
  items: ContentItem[] | ContentItem | null | undefined,
): ContentItem[] {
  if (!items) {
    return [];
  }

  if (Array.isArray(items)) {
    return items;
  }

  return isContentItem(items) ? [items] : [];
}
