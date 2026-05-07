import { z } from "zod";

export const querySchema = z.object({
  body: z.object({
    question: z
      .string({ required_error: "Question is required" })
      .min(1, "Question cannot be empty")
      .max(2000, "Question is too long (max 2000 characters)"),
    topK: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .default(5),
  }),
});

export type QueryInput = z.infer<typeof querySchema>["body"];
