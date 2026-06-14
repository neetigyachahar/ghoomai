import type { WidgetComponent } from "./types";
import { DemoActionWidget } from "./widgets/demo-action";
import { DemoSectionWidget } from "./widgets/demo-section";

export const widgetRegistry: Record<string, WidgetComponent> = {
  "demo-section": DemoSectionWidget as unknown as WidgetComponent,
  "demo-action": DemoActionWidget as unknown as WidgetComponent,
};
