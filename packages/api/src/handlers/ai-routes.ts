import type { AIMessage, WidgetAIMetadata } from "@repo/types";

import { formatSseEvent } from "../internal/sse";
import {
  getClientApiKeyFromRequest,
  isServerApiKeyConfigured,
  resolveAnthropicApiKey,
} from "../resolve-anthropic-api-key";
import { runWidgetAI } from "../run-widget-ai";

export function GETAiConfig() {
  return Response.json({
    serverKeyConfigured: isServerApiKeyConfigured(process.env.ANTHROPIC_API_KEY),
  });
}

export async function POSTAiLayout(request: Request) {
  const body = (await request.json()) as {
    messages: AIMessage[];
    widgetRegistry: Record<string, WidgetAIMetadata>;
  };

  const apiKey = resolveAnthropicApiKey(
    process.env.ANTHROPIC_API_KEY,
    getClientApiKeyFromRequest(request),
  );

  if (!apiKey) {
    return Response.json({ error: "Missing API key" }, { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(formatSseEvent(event, data)));
      };

      try {
        const result = await runWidgetAI({
          apiKey,
          messages: body.messages,
          widgetRegistry: body.widgetRegistry,
          onProgress: (event) => send("progress", event),
        });

        send("result", result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to generate layout";
        send("error", { error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
