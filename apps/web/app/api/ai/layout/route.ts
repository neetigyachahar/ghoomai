import type { AIMessage, WidgetAIMetadata, WidgetAIResponse } from "@repo/types";

import { runWidgetAI } from "@repo/api";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      messages: AIMessage[];
      widgetRegistry: Record<string, WidgetAIMetadata>;
    };

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return Response.json({ error: "Missing ANTHROPIC_API_KEY" }, { status: 500 });
    }

    const result: WidgetAIResponse = await runWidgetAI({
      apiKey,
      messages: body.messages,
      widgetRegistry: body.widgetRegistry,
    });

    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate layout";

    return Response.json({ error: message }, { status: 500 });
  }
}
