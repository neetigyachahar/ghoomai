import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { AIProgressEvent, AIProgressEventType } from "@repo/types";
import { z } from "zod";

import {
  getUserPersonalization,
  searchBuses,
  searchCabs,
  searchFlights,
  searchHotels,
  searchTrains,
} from "../services/travel";

type BetaTool = ReturnType<typeof betaZodTool>;

function withProgress(
  tool: BetaTool,
  eventType: AIProgressEventType,
  onProgress?: (event: AIProgressEvent) => void,
): BetaTool {
  const originalRun = tool.run.bind(tool) as (
    input: unknown,
    context?: unknown,
  ) => ReturnType<BetaTool["run"]>;

  return {
    ...tool,
    run: async (input: unknown, context?: unknown) => {
      onProgress?.({ type: eventType });
      return originalRun(input, context);
    },
  };
}

const searchFlightsToolBase = betaZodTool({
  name: "search_flights",
  description:
    "Search available flights between two cities. Use for long-distance routes such as Bangalore to Delhi, Delhi to Manali (Kullu airport), or Delhi to Chandigarh. Filter by departure time when the user wants Friday evening or Saturday morning options.",
  inputSchema: z.object({
    from: z.string().describe("Origin city, e.g. Bangalore or Delhi"),
    to: z.string().describe("Destination city, e.g. Delhi or Chandigarh"),
    afterTime: z
      .string()
      .optional()
      .describe("Earliest departure time in HH:mm, e.g. 18:00 for evening flights"),
    beforeTime: z
      .string()
      .optional()
      .describe("Latest departure time in HH:mm, e.g. 12:00 for morning flights"),
  }),
  run: async (input) => JSON.stringify(searchFlights(input), null, 2),
});

const searchBusesToolBase = betaZodTool({
  name: "search_buses",
  description:
    "Search bus options between two cities. Use overnight=true for Delhi↔Manali overnight sleeper buses. Results include id, operator, times, and price.",
  inputSchema: z.object({
    from: z.string().describe("Origin city, e.g. Delhi or Chandigarh"),
    to: z.string().describe("Destination city, e.g. Manali"),
    overnight: z
      .boolean()
      .optional()
      .describe("When true, return only overnight sleeper buses"),
    afterTime: z
      .string()
      .optional()
      .describe("Earliest departure time in HH:mm"),
  }),
  run: async (input) => JSON.stringify(searchBuses(input), null, 2),
});

const searchTrainsToolBase = betaZodTool({
  name: "search_trains",
  description:
    "Search train options between two cities. Useful for Delhi to Chandigarh connections before continuing to Manali.",
  inputSchema: z.object({
    from: z.string().describe("Origin city"),
    to: z.string().describe("Destination city"),
    afterTime: z
      .string()
      .optional()
      .describe("Earliest departure time in HH:mm"),
  }),
  run: async (input) => JSON.stringify(searchTrains(input), null, 2),
});

const searchCabsToolBase = betaZodTool({
  name: "search_cabs",
  description:
    "Search outstation cab options between two locations. Use for airport transfers and inter-city legs. For local sightseeing within a destination (temple, valley, etc.), do NOT invent ids — use resourceId \"local-cab\" with cabDetails in the layout instead.",
  inputSchema: z.object({
    from: z.string().describe("Pickup location or city"),
    to: z.string().describe("Drop location or city"),
    afterTime: z
      .string()
      .optional()
      .describe("Earliest departure time in HH:mm"),
  }),
  run: async (input) => JSON.stringify(searchCabs(input), null, 2),
});

const searchHotelsToolBase = betaZodTool({
  name: "search_hotels",
  description:
    "Search hotels and homestays at a destination. Set applyPersonalization=true to filter by the user's saved preferences (preferred accommodation type and budget). Always call get_user_personalization before searching if you need tailored stay options.",
  inputSchema: z.object({
    location: z.string().describe("Destination area, e.g. Manali"),
    type: z
      .enum(["hotel", "homestay", "resort"])
      .optional()
      .describe("Optional accommodation type override"),
    applyPersonalization: z
      .boolean()
      .optional()
      .describe("When true, apply the user's saved accommodation and budget preferences"),
  }),
  run: async (input) => JSON.stringify(searchHotels(input), null, 2),
});

const getUserPersonalizationToolBase = betaZodTool({
  name: "get_user_personalization",
  description:
    "Return saved user travel preferences such as preferred accommodation type (homestay, hotel, resort) and budget tier. Call this before search_hotels when recommending stays.",
  inputSchema: z.object({}),
  run: async () => JSON.stringify(getUserPersonalization(), null, 2),
});

function createNotifyBuildingLayoutTool(
  onProgress?: (event: AIProgressEvent) => void,
) {
  return betaZodTool({
    name: "notify_building_layout",
    description:
      "Signal that all search tools are complete and you are about to compose the final layout JSON. Call this exactly once, immediately before returning the layout response — never call it when asking a clarifying question.",
    inputSchema: z.object({}),
    run: async () => {
      onProgress?.({ type: "building_layout" });
      return JSON.stringify({ ok: true });
    },
  });
}

export const searchFlightsTool = searchFlightsToolBase;
export const searchBusesTool = searchBusesToolBase;
export const searchTrainsTool = searchTrainsToolBase;
export const searchCabsTool = searchCabsToolBase;
export const searchHotelsTool = searchHotelsToolBase;
export const getUserPersonalizationTool = getUserPersonalizationToolBase;

export function createTravelTools(
  onProgress?: (event: AIProgressEvent) => void,
): BetaTool[] {
  return [
    withProgress(searchFlightsToolBase as BetaTool, "search_flights", onProgress),
    withProgress(searchBusesToolBase as BetaTool, "search_buses", onProgress),
    withProgress(searchTrainsToolBase as BetaTool, "search_trains", onProgress),
    withProgress(searchCabsToolBase as BetaTool, "search_cabs", onProgress),
    withProgress(searchHotelsToolBase as BetaTool, "search_hotels", onProgress),
    withProgress(
      getUserPersonalizationToolBase as BetaTool,
      "get_user_personalization",
      onProgress,
    ),
    createNotifyBuildingLayoutTool(onProgress) as BetaTool,
  ];
}

export const travelTools = createTravelTools();
