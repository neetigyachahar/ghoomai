import { z } from "zod";

/** Plain schema for Anthropic structured output — no transforms (JSON Schema cannot represent them). */
export const questionResponseSchema = z.object({
  type: z.literal("question"),
  question: z.string().min(1),
  options: z.array(z.string()).max(2).optional(),
});

export type QuestionResponse = z.infer<typeof questionResponseSchema>;
