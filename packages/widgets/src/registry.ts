import type {
  WidgetAIMetadata,
  WidgetComponent,
  WidgetRegistryEntry,
} from "./types";
import { DemoActionWidget } from "./widgets/demo-action";
import { DemoSectionWidget } from "./widgets/demo-section";

const widgetDefinitions = {
  "demo-section": {
    component: DemoSectionWidget as unknown as WidgetComponent,
    description:
      "Card-style section with a title and optional child content areas.",
    props: {
      title: {
        type: "string",
        required: true,
        description: "Heading displayed at the top of the section.",
      },
    },
    slots: {
      children: {
        description: "Primary content rendered below the title.",
      },
      footer: {
        description: "Secondary content rendered at the bottom of the section.",
      },
    },
  },
  "demo-action": {
    component: DemoActionWidget as unknown as WidgetComponent,
    description:
      "Interactive action button. Booking actions use shared booking state via hooks.",
    props: {
      label: {
        type: "string",
        required: true,
        description: "Button label text.",
      },
      action: {
        type: "string",
        required: false,
        description:
          "Controls button behaviour. Use 'book' for booking actions that update booking count.",
        enum: ["book", "info"],
        default: "info",
      },
    },
  },
} satisfies Record<string, WidgetRegistryEntry>;

export function getWidgetRegistry(): Record<string, WidgetComponent> {
  return Object.fromEntries(
    Object.entries(widgetDefinitions).map(([key, { component }]) => [
      key,
      component,
    ]),
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
