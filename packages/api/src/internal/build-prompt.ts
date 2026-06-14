import type { WidgetAIMetadata } from "@repo/types";

export function buildSystemPrompt(
  widgetRegistry: Record<string, WidgetAIMetadata>,
): string {
  return [
    "You help users plan travel UI layouts using a fixed widget registry.",
    "Respond ONLY with JSON matching the required schema.",
    "",
    "If you need more information before building the layout, respond with:",
    '{ "type": "question", "question": "<your question>" }',
    "",
    "When you have enough information, respond with:",
    '{ "type": "layout", "layout": <ContentItem tree> }',
    "",
    "ContentItem shape:",
    '{ "key": "<widget-id>", "props": { ... }, "children": { "<slot>": [ ContentItem, ... ] } | null }',
    "",
    "Available widgets:",
    JSON.stringify(widgetRegistry, null, 2),
  ].join("\n");
}
