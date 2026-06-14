"use client";

import { DemoBookingProvider } from "@repo/hooks/demo";
import { ContentRenderer, type ContentItem } from "@repo/widgets";

const content: ContentItem = {
  key: "demo-section",
  props: { title: "Ghoomai Widgets (Web)" },
  children: {
    children: [
      {
        key: "demo-action",
        props: { label: "Book a hotel", action: "book" },
        children: null,
      },
    ],
    footer: [
      {
        key: "demo-action",
        props: { label: "Learn more", action: "info" },
        children: null,
      },
    ],
  },
};

export function DemoWidget() {
  return (
    <DemoBookingProvider>
      <ContentRenderer content={content} />
    </DemoBookingProvider>
  );
}
