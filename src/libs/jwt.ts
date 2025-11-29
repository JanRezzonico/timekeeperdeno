import { Jwt } from "hono/utils/jwt";
import { env } from "./env.ts";
import { Context } from "hono";

const sign = async (sub: string) => await Jwt.sign({ sub }, env.JWT_SECRET);
const getSubOrThrow = (c: Context) => {
  const payload = c.get("jwtPayload");
  const { sub } = payload;
  if (!sub) throw new Error("JWT payload does not contain 'sub' claim");
  return sub as string;
};

export { getSubOrThrow, sign };
