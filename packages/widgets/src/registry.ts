import type {
  WidgetAIMetadata,
  WidgetComponent,
  WidgetRegistryEntry,
} from "./types";
import { ContentBlockWidget } from "./widgets/content-block";
import { PlanChoiceWidget } from "./widgets/plan-choice";
import {
  TravelOfferWidget,
  TravelRecommendationWidget,
} from "./widgets/travel-recommendation";
import { TripHeaderWidget } from "./widgets/trip-header";
import { WidgetErrorWidget } from "./widgets/widget-error";

const travelRecommendationProps = {
  dayLabel: {
    type: "string",
    required: true,
    description:
      "Which day of the trip this step belongs to. Examples: \"Day 1\", \"Day 2\", \"Day 3\".",
  },
  resourceType: {
    type: "string",
    required: true,
    description: "Travel resource type for the single recommended option.",
    enum: ["flight", "bus", "train", "cab", "hotel"],
  },
  resourceId: {
    type: "string",
    required: true,
    description:
      "Exact id from tool search results. For local sightseeing rides with no catalog match, use \"local-cab\" and fill cabDetails.",
  },
  sectionTitle: {
    type: "string",
    required: true,
    description:
      "Timeline step label in sentence case. Examples: \"Getting there\", \"Check in\", \"Solang Valley\", \"Return to Delhi\".",
  },
  stepTime: {
    type: "string",
    required: true,
    description:
      "When this step happens — shown next to the label. Include day + time range. Examples: \"Fri 9:00 PM – Sat 7:30 AM\", \"Sat 1:00 PM\", \"Sun 6:00 AM\".",
  },
  sectionDescription: {
    type: "string",
    required: false,
    description:
      "Optional 1–2 short sentences explaining this step. Sentence case. Do not repeat times/prices from the offer widget.",
  },
  highlight: {
    type: "string",
    required: false,
    description: "Deprecated — use sectionDescription instead.",
  },
  cabDetails: {
    type: "object",
    required: false,
    description:
      "Inline cab details for local rides when no catalog id exists. Required when resourceId is \"local-cab\". Fields: from, to, provider?, vehicleType?, departureTime?, durationMinutes?, priceInr?, dayLabel?.",
  },
};

const widgetDefinitions = {
  "trip-header": {
    component: TripHeaderWidget as unknown as WidgetComponent,
    description:
      "Primary page header for a trip. Renders a bold title, optional one-line subtitle, and a grid of key trip stats (dates, travelers, duration, budget, etc.). Use this ONCE as the first widget on a trip results page instead of a prose intro.",
    props: {
      title: {
        type: "string",
        required: true,
        description:
          "Trip route as the headline. Example: \"Delhi to Manali\" or \"Delhi → Manali\".",
      },
      subtitle: {
        type: "string",
        required: false,
        description:
          "Optional single line of context (max 10 words). Example: \"Relaxed weekend escape\". Omit if stats say enough.",
      },
      stats: {
        type: "array",
        required: false,
        description:
          "Exactly 2 or 4 key facts rendered as a 2-column stat grid (never 1 or 3). Each item is { label, value } with short text. Examples (4): Dates, Nights, Travelers, Budget. Examples (2): Dates, Budget.",
      },
    },
  },
  "content-block": {
    component: ContentBlockWidget as unknown as WidgetComponent,
    description:
      "Short text block with optional heading. Use for informational answers about places (one block per place: heading = place name, content = why visit / tips). Use for one-line tips between trip steps. Do NOT use for transport or booking offers — those need travel-recommendation.",
    props: {
      heading: {
        type: "string",
        required: false,
        description: "Place name or short heading (max 6 words).",
      },
      content: {
        type: "string",
        required: true,
        description:
          "One or two short sentences. For places: distance, highlights, best time to visit.",
      },
    },
  },
  "travel-recommendation": {
    component: TravelRecommendationWidget as unknown as WidgetComponent,
    description:
      "One step on the trip timeline. Shows a label, time range, optional note, and a single travel offer loaded by resource id. Use for outbound, check-in, local rides, activities, and return — each as a separate timeline step in chronological order.",
    props: travelRecommendationProps,
  },
  "travel-offer": {
    component: TravelOfferWidget as unknown as WidgetComponent,
    description:
      "Alias for travel-recommendation. Prefer travel-recommendation for new layouts.",
    props: travelRecommendationProps,
  },
  "plan-choice": {
    component: PlanChoiceWidget as unknown as WidgetComponent,
    description:
      "Mutually exclusive pick-one step with or-dividers. Use when the user must choose between alternatives (bus vs flight, hotels, activity slots). Max 2 options — skip plan-choice if only one option (use travel-recommendation). Each option needs id (slot key), label, and summary. NOT for listing all places without picking (use content-block for that).",
    props: {
      dayLabel: {
        type: "string",
        required: true,
        description:
          "Which day of the trip this choice belongs to. Examples: \"Day 1\", \"Day 2\".",
      },
      title: {
        type: "string",
        required: true,
        description: "The choice question shown inside the step (max 10 words).",
      },
      stepLabel: {
        type: "string",
        required: false,
        description:
          "Timeline step label if different from title. Example: \"Things to do\", \"Pick a stay\".",
      },
      stepTime: {
        type: "string",
        required: false,
        description:
          "When this decision happens. Example: \"Sat morning\", \"Sat 2:00 PM\".",
      },
      description: {
        type: "string",
        required: false,
        description:
          "Optional 1–2 sentences of context for the choice. Sentence case.",
      },
      options: {
        type: "array",
        required: true,
        description:
          "Ordered choices — 1–2 items max. Each item: id (children slot key), label (place or mode name), summary (one line why).",
      },
    },
    slots: {
      "[option.id]": {
        description:
          "Named slot matching an option id. Place the full widget subtree for that choice (e.g. travel-recommendation). Rendered only after the user selects this option.",
        required: true,
      },
    },
  },
} satisfies Record<string, WidgetRegistryEntry>;

const internalWidgetDefinitions = {
  "widget-error": {
    component: WidgetErrorWidget as unknown as WidgetComponent,
    description: "Internal fallback for invalid or failed widgets.",
  },
} satisfies Record<string, Pick<WidgetRegistryEntry, "component" | "description">>;

export function getWidgetRegistry(): Record<string, WidgetComponent> {
  return Object.fromEntries(
    Object.entries({ ...widgetDefinitions, ...internalWidgetDefinitions }).map(
      ([key, { component }]) => [key, component],
    ),
  );
}

export function getWidgetRegistryForAI(): Record<string, WidgetAIMetadata> {
  return Object.fromEntries(
    Object.entries(widgetDefinitions).map(([key, entry]) => {
      const metadata: WidgetAIMetadata = {
        description: entry.description,
      };

      if (entry.props) {
        metadata.props = entry.props;
      }

      if ("slots" in entry && entry.slots) {
        metadata.slots = entry.slots;
      }

      return [key, metadata];
    }),
  );
}
