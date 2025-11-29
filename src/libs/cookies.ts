import { env } from "./env.ts";

const cookies = {
  jwt: {
    name: "timekeeper_auth_jwt",
    options: {
      httpOnly: Deno.env.get("ENV") === "production",
      secure: Deno.env.get("ENV") === "production",
      sameSite: "Lax" as const,
      maxAge: env.JWT_EXPIRATION_MINUTES * 60,
    },
  },
  refreshToken: {
    name: "timekeeper_auth_refresh_token",
    options: {
      httpOnly: Deno.env.get("ENV") === "production",
      secure: Deno.env.get("ENV") === "production",
      sameSite: "Lax" as const,
      maxAge: env.REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60,
    },
  },
};

export default cookies;
