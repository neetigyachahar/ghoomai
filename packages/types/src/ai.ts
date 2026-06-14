import type { ContentItem } from "./content";

export type AIStatus =
  | "idle"
  | "loading"
  | "awaiting_answer"
  | "complete"
  | "error";

export type AIMessage = {
  role: "user" | "assistant";
  content: string;
};

export type WidgetAIResponse =
  | { type: "question"; question: string }
  | { type: "layout"; layout: ContentItem };
