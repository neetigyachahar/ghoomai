import type { WidgetAIResponse } from "@repo/types";

import { sanitizeQuestionResponse } from "./sanitize-question-response";

function extractJsonText(text: string): string {
  const trimmed = text.trim();

  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }

  if (trimmed.startsWith("{")) {
    return trimmed;
  }

  const start = trimmed.indexOf("{");

  if (start === -1) {
    throw new Error("AI response did not contain JSON");
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < trimmed.length; index += 1) {
    const char = trimmed[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      depth += 1;
    }

    if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return trimmed.slice(start, index + 1);
      }
    }
  }

  throw new Error("AI response contained incomplete JSON");
}

export function parseWidgetAIResponse(text: string): WidgetAIResponse {
  const jsonText = extractJsonText(text);

  let parsed: WidgetAIResponse;

  try {
    parsed = JSON.parse(jsonText) as WidgetAIResponse;
  } catch {
    throw new Error(
      `AI response was not valid JSON: ${jsonText.slice(0, 80)}...`,
    );
  }

  if (parsed.type === "question") {
    if (!parsed.question) {
      throw new Error("AI response missing question");
    }

    if (
      parsed.options !== undefined &&
      (!Array.isArray(parsed.options) ||
        parsed.options.some((option) => typeof option !== "string"))
    ) {
      throw new Error("AI response options must be an array of strings");
    }

    return sanitizeQuestionResponse(parsed);
  }

  if (parsed.type === "layout") {
    if (!parsed.layout) {
      throw new Error("AI response missing layout");
    }

    return parsed;
  }

  throw new Error("AI response has invalid type");
}
