import type { AIProgressEventType } from "@repo/types";

export interface AiProgressStripProps {
  eventType: AIProgressEventType;
  /** Renders as the top band inside a prompt composer — no outer card chrome. */
  embedded?: boolean;
}

export const AI_PROGRESS_LABELS: Record<AIProgressEventType, string> = {
  search_flights: "Searching flights…",
  search_buses: "Searching buses…",
  search_trains: "Searching trains…",
  search_cabs: "Searching cabs…",
  search_hotels: "Searching stays…",
  get_user_personalization: "Reading your preferences…",
  building_layout: "Building your trip…",
};
