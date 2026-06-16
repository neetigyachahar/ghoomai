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

export type AIProgressEventType =
  | "search_flights"
  | "search_buses"
  | "search_trains"
  | "search_cabs"
  | "search_hotels"
  | "get_user_personalization"
  | "building_layout";

export type AIProgressEvent = {
  type: AIProgressEventType;
};
