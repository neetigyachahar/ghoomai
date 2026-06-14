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

export type WidgetAIMetadata = {
  description: string;
  props?: Record<string, WidgetPropDefinition>;
  slots?: Record<string, WidgetSlotDefinition>;
};
