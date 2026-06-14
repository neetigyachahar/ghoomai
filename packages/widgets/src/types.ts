import type { ComponentType } from "react";

export type {
  ContentChildren,
  ContentItem,
  WidgetAIMetadata,
  WidgetPropDefinition,
  WidgetSlotDefinition,
} from "@repo/types";

import type {
  WidgetPropDefinition,
  WidgetSlotDefinition,
} from "@repo/types";

export type WidgetComponent = ComponentType<Record<string, unknown>>;

export type WidgetRegistryEntry = {
  component: WidgetComponent;
  description: string;
  props?: Record<string, WidgetPropDefinition>;
  slots?: Record<string, WidgetSlotDefinition>;
};
