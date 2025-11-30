import { Jwt } from "hono/utils/jwt";
import { env } from "./env.ts";

const signJwt = async (sub: string) =>
  await Jwt.sign(
    {
      sub,
      exp: Math.floor(Date.now() / 1000) + env.JWT_EXPIRATION_MINUTES * 60,
    },
    env.JWT_SECRET
  );

export { signJwt };
