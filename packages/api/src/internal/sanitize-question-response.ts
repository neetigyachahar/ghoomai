import type { AIQuestion } from "@repo/types";

const QUESTION_START =
  /^(which|what|when|where|how many|how much|who|do you|are you|could you|can you|will you|did you|would you)\b/i;

export function looksLikeQuestion(text: string): boolean {
  const trimmed = text.trim();

  if (!trimmed) {
    return false;
  }

  if (trimmed.endsWith("?")) {
    return true;
  }

  return QUESTION_START.test(trimmed);
}

export function sanitizeQuestionOptions(
  options?: string[],
): string[] | undefined {
  if (!options?.length) {
    return undefined;
  }

  const answers = options
    .map((option) => option.trim())
    .filter((option) => option.length > 0 && !looksLikeQuestion(option));

  return answers.length > 0 ? answers.slice(0, 2) : undefined;
}

export function sanitizeQuestionResponse(question: AIQuestion): AIQuestion {
  return {
    ...question,
    question: question.question.trim(),
    options: sanitizeQuestionOptions(question.options),
  };
}
