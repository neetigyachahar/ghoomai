export interface ContentItem {
  key: string;
  props: Record<string, unknown>;
  children: ContentChildren | null;
}

export type ContentChildren = {
  [slot: string]: ContentItem[] | null | undefined;
};
