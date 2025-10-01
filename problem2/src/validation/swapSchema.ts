import { z } from "zod";

export const swapSchema = z.object({
  fromToken: z.string().min(1, "Select a token"),
  toToken: z.string().min(1, "Select a token"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => Number(val) > 0, "Amount must be greater than 0"),
});

export type SwapFormValues = z.infer<typeof swapSchema>;
