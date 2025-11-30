import "dotenv/config";
import z from "@zod/zod";

const schema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(10),
  REDIS_URL: z.url(),
  REFRESH_TOKEN_EXPIRATION_DAYS: z.coerce.number().min(1).default(30),
  REFRESH_TOKEN_SECRET: z.string().min(10),
  JWT_EXPIRATION_MINUTES: z.coerce.number().min(1).default(60),
  EMAIL_VERIFICATION_TOKEN_EXPIRATION_HOURS: z.coerce
    .number()
    .min(1)
    .default(24),
});

const parsedEnv = schema.safeParse(Deno.env.toObject());

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  Deno.exit(1);
}

export const env = parsedEnv.data;
