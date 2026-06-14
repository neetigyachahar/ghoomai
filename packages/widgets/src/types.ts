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

export type WidgetPropDefinition = {
  type: string;
  required?: boolean;
  description?: string;
  enum?: string[];
  default?: unknown;
};

export type WidgetSlotDefinition = {
  description?: string;
  required?: boolean;
};

export type WidgetRegistryEntry = {
  component: WidgetComponent;
  description: string;
  props?: Record<string, WidgetPropDefinition>;
  slots?: Record<string, WidgetSlotDefinition>;
};

export type WidgetAIMetadata = {
  description: string;
  props?: Record<string, WidgetPropDefinition>;
  slots?: Record<string, WidgetSlotDefinition>;
};
