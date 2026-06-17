import { z } from "zod";

import type { ContentItem } from "@repo/types";

export const travelResourceTypeSchema = z.enum([
  "flight",
  "bus",
  "train",
  "cab",
  "hotel",
]);

export const cabDetailsSchema = z.object({
  provider: z.string().optional(),
  from: z.string().min(1),
  to: z.string().min(1),
  vehicleType: z.string().optional(),
  dayLabel: z.string().optional(),
  departureTime: z.string().optional(),
  durationMinutes: z.number().optional(),
  priceInr: z.number().optional(),
});

export const travelRecommendationPropsSchema = z.object({
  dayLabel: z.string().min(1),
  resourceType: travelResourceTypeSchema,
  resourceId: z.string().min(1),
  sectionTitle: z.string().min(1),
  stepTime: z.string().min(1),
  sectionDescription: z.string().optional(),
  highlight: z.string().optional(),
  cabDetails: cabDetailsSchema.optional(),
});

export const contentBlockPropsSchema = z.object({
  content: z.string().min(1),
  heading: z.string().optional(),
});

export const tripStatSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const tripHeaderPropsSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  stats: z
    .array(tripStatSchema)
    .optional()
    .transform((stats) => {
      if (!stats?.length) {
        return undefined;
      }

      if (stats.length === 1) {
        return undefined;
      }

      if (stats.length === 3) {
        return stats.slice(0, 2);
      }

      if (stats.length > 4) {
        return stats.slice(0, 4);
      }

      return stats;
    })
    .refine(
      (stats) =>
        stats === undefined || stats.length === 2 || stats.length === 4,
      { message: "trip-header stats must contain exactly 2 or 4 items" },
    ),
});

export const planChoiceOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  summary: z.string().optional(),
});

export const planChoicePropsSchema = z.object({
  dayLabel: z.string().min(1),
  title: z.string().min(1),
  stepLabel: z.string().optional(),
  stepTime: z.string().optional(),
  description: z.string().optional(),
  options: z
    .array(planChoiceOptionSchema)
    .min(1)
    .transform((options) => options.slice(0, 2)),
});

export function formatZodIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "value";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}

export function buildContentItemSchema(widgetKeys: string[]) {
  if (widgetKeys.length === 0) {
    throw new Error("At least one widget key is required");
  }

  const contentItemSchema: z.ZodType<ContentItem> = z.lazy(() => {
    const variants: z.ZodType<ContentItem>[] = [];

    if (widgetKeys.includes("trip-header")) {
      variants.push(
        z.object({
          key: z.literal("trip-header"),
          props: tripHeaderPropsSchema,
          children: z.null(),
        }),
      );
    }

    if (widgetKeys.includes("content-block")) {
      variants.push(
        z.object({
          key: z.literal("content-block"),
          props: contentBlockPropsSchema,
          children: z.null(),
        }),
      );
    }

    if (widgetKeys.includes("travel-recommendation")) {
      variants.push(
        z.object({
          key: z.literal("travel-recommendation"),
          props: travelRecommendationPropsSchema,
          children: z.null(),
        }),
      );
    }

    if (widgetKeys.includes("travel-offer")) {
      variants.push(
        z.object({
          key: z.literal("travel-offer"),
          props: travelRecommendationPropsSchema,
          children: z.null(),
        }),
      );
    }

    if (widgetKeys.includes("plan-choice")) {
      variants.push(
        z.object({
          key: z.literal("plan-choice"),
          props: planChoicePropsSchema,
          children: z
            .record(z.string(), z.array(contentItemSchema).min(1))
            .nullable(),
        }),
      );
    }

    if (variants.length === 0) {
      throw new Error("No schema variants matched the provided widget keys");
    }

    if (variants.length === 1) {
      return variants[0]!;
    }

    return z.union(
      variants as [
        z.ZodType<ContentItem>,
        z.ZodType<ContentItem>,
        ...z.ZodType<ContentItem>[],
      ],
    );
  });

  return contentItemSchema;
}

export function buildLayoutResponseSchema(widgetKeys: string[]) {
  const contentItemSchema = buildContentItemSchema(widgetKeys);

  return z.object({
    type: z.literal("layout"),
    layout: z.union([contentItemSchema, z.array(contentItemSchema).min(1)]),
  });
}

export type LayoutResponse = z.infer<
  ReturnType<typeof buildLayoutResponseSchema>
>;
