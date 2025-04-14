import { z } from "zod";

export const checkProfanitySchema = z.object({
  checkProfanity: z.boolean(),
});
