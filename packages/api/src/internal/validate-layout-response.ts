import {
  toContentItemArray,
  type ContentChildren,
  type ContentItem,
  type WidgetAIResponse,
} from "@repo/types";
import type { ZodType } from "zod";

import {
  buildContentItemSchema,
  formatZodIssues,
  planChoicePropsSchema,
} from "./layout-response-schema";

export const WIDGET_ERROR_KEY = "widget-error";

export function createWidgetErrorItem(
  widgetKey: string,
  message: string,
  details?: string,
): ContentItem {
  return {
    key: WIDGET_ERROR_KEY,
    props: {
      widgetKey,
      message,
      ...(details ? { details } : {}),
    },
    children: null,
  };
}

function isContentItemShape(value: unknown): value is ContentItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "key" in value &&
    typeof (value as ContentItem).key === "string"
  );
}

function sanitizeChildren(
  children: ContentChildren | null | undefined,
  contentItemSchema: ZodType<ContentItem>,
  allowedKeys: Set<string>,
): ContentChildren | null {
  if (!children) {
    return null;
  }

  const sanitized: ContentChildren = {};

  for (const [slotName, items] of Object.entries(children)) {
    if (!items) {
      sanitized[slotName] = items;
      continue;
    }

    sanitized[slotName] = toContentItemArray(items)
      .filter(isContentItemShape)
      .map((item) => sanitizeContentItem(item, contentItemSchema, allowedKeys));
  }

  return sanitized;
}

function sanitizePlanChoiceItem(
  item: ContentItem,
  contentItemSchema: ZodType<ContentItem>,
  allowedKeys: Set<string>,
): ContentItem {
  const propsResult = planChoicePropsSchema.safeParse(item.props ?? {});

  if (!propsResult.success) {
    return createWidgetErrorItem(
      item.key,
      "This choice step has invalid props.",
      formatZodIssues(propsResult.error),
    );
  }

  return {
    key: "plan-choice",
    props: propsResult.data,
    children: filterPlanChoiceChildren(
      sanitizeChildren(item.children, contentItemSchema, allowedKeys),
      propsResult.data.options.map((option) => option.id),
    ),
  };
}

function filterPlanChoiceChildren(
  children: ContentChildren | null | undefined,
  optionIds: string[],
): ContentChildren | null {
  if (!children) {
    return null;
  }

  const allowed = new Set(optionIds);
  const filtered = Object.fromEntries(
    Object.entries(children).filter(([slotId]) => allowed.has(slotId)),
  );

  return Object.keys(filtered).length > 0 ? filtered : null;
}

export function sanitizeContentItem(
  item: unknown,
  contentItemSchema: ZodType<ContentItem>,
  allowedKeys: Set<string>,
): ContentItem {
  if (!isContentItemShape(item)) {
    return createWidgetErrorItem(
      "unknown",
      "A widget entry was not a valid object.",
    );
  }

  if (item.key === WIDGET_ERROR_KEY) {
    return {
      key: WIDGET_ERROR_KEY,
      props: item.props ?? {},
      children: null,
    };
  }

  if (!allowedKeys.has(item.key)) {
    return createWidgetErrorItem(
      item.key,
      `Unknown widget key "${item.key}".`,
    );
  }

  if (item.key === "plan-choice") {
    return sanitizePlanChoiceItem(item, contentItemSchema, allowedKeys);
  }

  const result = contentItemSchema.safeParse({
    key: item.key,
    props: item.props ?? {},
    children: item.children ?? null,
  });

  if (!result.success) {
    return createWidgetErrorItem(
      item.key,
      "This section has invalid data.",
      formatZodIssues(result.error),
    );
  }

  return result.data;
}

function normalizeLayoutItems(layout: unknown): unknown[] {
  if (Array.isArray(layout)) {
    return layout;
  }

  if (isContentItemShape(layout)) {
    return [layout];
  }

  return [];
}

export function sanitizeLayoutResponse(
  response: WidgetAIResponse,
  widgetKeys: string[],
): WidgetAIResponse {
  if (response.type === "question") {
    return response;
  }

  if (response.type !== "layout") {
    const unexpectedType = (response as { type: string }).type;
    return {
      type: "layout",
      layout: [
        createWidgetErrorItem(
          "layout",
          `Expected layout response but got "${unexpectedType}".`,
        ),
      ],
    };
  }

  const allowedKeys = new Set(widgetKeys);
  const contentItemSchema = buildContentItemSchema(widgetKeys);
  const rawItems = normalizeLayoutItems(response.layout);

  if (rawItems.length === 0) {
    return {
      type: "layout",
      layout: [
        createWidgetErrorItem(
          "layout",
          "The layout was empty or not an array of widgets.",
        ),
      ],
    };
  }

  const layout = rawItems.map((item) =>
    sanitizeContentItem(item, contentItemSchema, allowedKeys),
  );

  return { type: "layout", layout };
}

/** @deprecated Use sanitizeLayoutResponse — kept as alias for callers. */
export function validateLayoutResponse(
  response: WidgetAIResponse,
  widgetKeys: string[],
): WidgetAIResponse {
  return sanitizeLayoutResponse(response, widgetKeys);
}
