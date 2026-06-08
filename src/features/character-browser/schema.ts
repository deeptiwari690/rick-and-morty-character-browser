import { z } from "zod";

const InfoSchema = z.object({
  count: z.number(),
  pages: z.number(),
  next: z.string().nullable(),
  prev: z.string().nullable(),
});

const ResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(["Alive", "Dead", "unknown"]),
  image: z.string(),
});

export const ApiResponseSchema = z.object({
  info: InfoSchema,
  results: z.array(ResultSchema),
});

export type Info = z.infer<typeof InfoSchema>;
export type Result = z.infer<typeof ResultSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
