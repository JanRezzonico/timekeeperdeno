import { JwtVariables } from "hono/jwt";
import { env } from "../../libs/env.ts";
import cookies from "../../libs/cookies.ts";
import { Context, Next } from "hono";
import type { User } from "prismaclient";
import db from "../../libs/db.ts";
import { HTTPException } from "hono/http-exception";
import { getCookie, setCookie } from "hono/cookie";
import { Jwt } from "hono/utils/jwt";
import { consumeRefreshToken } from "../../libs/redis.ts";
import { sign } from "../../libs/jwt.ts";

const jwtCheck = async (c: AuthenticatedContext, next: Next) => {
  const token = getCookie(c, cookies.jwt.name);
  let payload;
  try {
    payload = token ? await Jwt.verify(token, env.JWT_SECRET) : false;
  } catch {
    payload = false;
  }

  if (payload) {
    c.set("jwtPayload", payload);
  } else {
    const refreshToken = getCookie(c, cookies.refreshToken.name);
    if (!refreshToken) throw new HTTPException(401);

    const consumationResult = await consumeRefreshToken(refreshToken);
    if (!consumationResult) throw new HTTPException(401);
    const { userId, newToken } = consumationResult;
    const newJwt = await sign(userId);
    setCookie(c, cookies.jwt.name, newJwt, cookies.jwt.options);
    setCookie(
      c,
      cookies.refreshToken.name,
      newToken,
      cookies.refreshToken.options
    );
    c.set("jwtPayload", { sub: userId });
  }
  await next();
};

type AuthenticatedVariables = JwtVariables & { user: User };

type AuthenticatedContext = Context<{
  Variables: AuthenticatedVariables;
}>;

const setUser = async (c: AuthenticatedContext, next: Next) => {
  const payload = c.get("jwtPayload");
  const { sub: id } = payload;

  const user = await db.user.findUnique({
    where: { id: id as string },
  });

  if (!user) throw new HTTPException(401);

  c.set("user", user);

  await next();
};

const authMiddleware = async (c: AuthenticatedContext, next: Next) => {
  await jwtCheck(c, async () => {
    await setUser(c, next);
  });
};

export default authMiddleware;
export type { AuthenticatedContext, AuthenticatedVariables };
