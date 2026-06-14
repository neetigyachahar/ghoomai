import Anthropic from "@anthropic-ai/sdk";

import type {
  AIMessage,
  WidgetAIMetadata,
  WidgetAIResponse,
} from "@repo/types";

import { buildSystemPrompt } from "./internal/build-prompt";
import { parseWidgetAIResponse } from "./internal/parse-ai-response";
import { travelTools } from "./tools/travel-tools";

const ANTHROPIC_MODEL = "claude-sonnet-4-6";
const MAX_TOOL_ITERATIONS = 12;

export interface RunWidgetAIInput {
  apiKey: string;
  messages: AIMessage[];
  widgetRegistry: Record<string, WidgetAIMetadata>;
}

function extractResponseText(
  content: Array<{ type: string; text?: string }>,
): string {
  const textBlocks = content.filter(
    (block): block is { type: "text"; text: string } =>
      block.type === "text" && typeof block.text === "string",
  );

  if (textBlocks.length === 0) {
    throw new Error("Unexpected response format from Anthropic");
  }

  return textBlocks.map((block) => block.text).join("\n").trim();
}

export async function runWidgetAI(
  input: RunWidgetAIInput,
): Promise<WidgetAIResponse> {
  const client = new Anthropic({ apiKey: input.apiKey });

  const runner = client.beta.messages.toolRunner({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    max_iterations: MAX_TOOL_ITERATIONS,
    system: buildSystemPrompt(input.widgetRegistry),
    messages: input.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
    tools: travelTools,
  });

  const finalMessage = await runner.runUntilDone();
  const text = extractResponseText(finalMessage.content);

  return parseWidgetAIResponse(text);
}
