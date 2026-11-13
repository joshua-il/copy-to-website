import { z } from "zod";

export const joinWaitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),
});

export type JoinWaitlistInput = z.input<typeof joinWaitlistSchema>;
