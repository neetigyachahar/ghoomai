import type { AIMessage, WidgetAIMetadata } from "@repo/types";

import {
  formatSseEvent,
  getClientApiKeyFromRequest,
  resolveAnthropicApiKey,
  runWidgetAI,
} from "@repo/api";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    messages: AIMessage[];
    widgetRegistry: Record<string, WidgetAIMetadata>;
  };

  const apiKey = resolveAnthropicApiKey(
    process.env.ANTHROPIC_API_KEY,
    getClientApiKeyFromRequest(req),
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
