import Anthropic from "@anthropic-ai/sdk";

import type {
  AIMessage,
  WidgetAIMetadata,
  WidgetAIResponse,
} from "@repo/types";

import { buildSystemPrompt } from "./internal/build-prompt";

const ANTHROPIC_MODEL = "claude-sonnet-4-6";

export interface RunWidgetAIInput {
  apiKey: string;
  messages: AIMessage[];
  widgetRegistry: Record<string, WidgetAIMetadata>;
}

function parseWidgetAIResponse(text: string): WidgetAIResponse {
  const trimmed = text.trim();
  const jsonText = trimmed.startsWith("```")
    ? trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
    : trimmed;

  const parsed = JSON.parse(jsonText) as WidgetAIResponse;

  if (parsed.type === "question" && !parsed.question) {
    throw new Error("AI response missing question");
  }

  if (parsed.type === "layout" && !parsed.layout) {
    throw new Error("AI response missing layout");
  }

  if (parsed.type !== "question" && parsed.type !== "layout") {
    throw new Error("AI response has invalid type");
  }

  return parsed;
}

export async function runWidgetAI(
  input: RunWidgetAIInput,
): Promise<WidgetAIResponse> {
  const client = new Anthropic({ apiKey: input.apiKey });

  const response = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    system: buildSystemPrompt(input.widgetRegistry),
    messages: input.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  });

  const block = response.content.find((item) => item.type === "text");

  if (!block || block.type !== "text") {
    throw new Error("Unexpected response format from Anthropic");
  }

  return parseWidgetAIResponse(block.text);
}
