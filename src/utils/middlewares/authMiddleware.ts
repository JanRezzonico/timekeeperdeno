import { jwt, JwtVariables } from "hono/jwt";
import { env } from "../../libs/env.ts";
import cookies from "../../libs/cookies.ts";
import { Context, Next } from "hono";
import type { User } from "prismaclient";
import db from "../../libs/db.ts";
import { HTTPException } from "hono/http-exception";

const jwtCheck = jwt({
  secret: env.JWT_SECRET,
  cookie: cookies.jwt.name,
});

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
