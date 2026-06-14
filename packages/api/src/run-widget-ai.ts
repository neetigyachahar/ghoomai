import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { BetaMessageParam } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages/messages";

import type {
  AIMessage,
  WidgetAIMetadata,
  WidgetAIResponse,
} from "@repo/types";

import { buildSystemPrompt } from "./internal/build-prompt";
import { parseWidgetAIResponse } from "./internal/parse-ai-response";
import { questionResponseSchema } from "./internal/question-response-schema";
import { sanitizeLayoutResponse } from "./internal/validate-layout-response";
import { travelTools } from "./tools/travel-tools";

// Demo / production — swap back for real demos
// const ANTHROPIC_MODEL = "claude-sonnet-4-6";
// Dev — cheaper for local iteration
const ANTHROPIC_MODEL = "claude-haiku-4-5";
const MAX_TOOL_ITERATIONS = 12;

const QUESTION_OUTPUT_FORMAT = zodOutputFormat(questionResponseSchema);

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

function conversationUsedTools(messages: BetaMessageParam[]): boolean {
  return messages.some(
    (message) =>
      message.role === "assistant" &&
      Array.isArray(message.content) &&
      message.content.some((block) => block.type === "tool_use"),
  );
}

function messagesForStructuredParse(
  conversationMessages: BetaMessageParam[],
): BetaMessageParam[] {
  return conversationMessages.at(-1)?.role === "assistant"
    ? conversationMessages.slice(0, -1)
    : conversationMessages;
}

export async function runWidgetAI(
  input: RunWidgetAIInput,
): Promise<WidgetAIResponse> {
  const client = new Anthropic({ apiKey: input.apiKey });
  const system = buildSystemPrompt(input.widgetRegistry);
  const widgetKeys = Object.keys(input.widgetRegistry);

  const runner = client.beta.messages.toolRunner({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    max_iterations: MAX_TOOL_ITERATIONS,
    system,
    messages: input.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
    tools: travelTools,
  });

  const finalMessage = await runner.runUntilDone();
  const conversationMessages = runner.params.messages;

  if (conversationUsedTools(conversationMessages)) {
    const loose = parseWidgetAIResponse(
      extractResponseText(finalMessage.content),
    );

    if (loose.type === "question") {
      return loose;
    }

    return sanitizeLayoutResponse(loose, widgetKeys);
  }

  const parsed = await client.messages.parse({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    system,
    messages: messagesForStructuredParse(
      conversationMessages,
    ) as MessageParam[],
    output_config: {
      format: QUESTION_OUTPUT_FORMAT,
    },
  });

  if (!parsed.parsed_output) {
    throw new Error("AI response did not match expected schema");
  }

  return parsed.parsed_output as WidgetAIResponse;
}
