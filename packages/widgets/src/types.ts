import type { ComponentType } from "react";

export interface ContentItem {
  key: string;
  props: Record<string, unknown>;
  children: ContentChildren | null;
}

export type ContentChildren = {
  [slot: string]: ContentItem[] | null | undefined;
};

export type WidgetComponent = ComponentType<Record<string, unknown>>;
