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

export type AIQuestion = {
  type: "question";
  question: string;
  options?: string[];
};

export type WidgetAIResponse =
  | AIQuestion
  | { type: "layout"; layout: ContentItem | ContentItem[] };
