import "dotenv/config";
import z from "@zod/zod";

const schema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(10),
});

const parsedEnv = schema.safeParse(Deno.env.toObject());

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  Deno.exit(1);
}

export const env = parsedEnv.data;
