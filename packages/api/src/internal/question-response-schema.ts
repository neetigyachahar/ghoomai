import { z } from "zod";

export const questionResponseSchema = z.object({
  type: z.literal("question"),
  question: z.string(),
  options: z.array(z.string()).optional(),
});

export type QuestionResponse = z.infer<typeof questionResponseSchema>;
