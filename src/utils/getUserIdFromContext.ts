import { Context } from "hono";
import { JwtVariables } from "hono/jwt";
import { HTTPException } from "hono/http-exception";

const getUserIdFromContext = (c: Context<{ Variables: JwtVariables }>) => {
  const payload = c.get("jwtPayload");
  const { sub: id } = payload;
  if (!id) throw new HTTPException(401);
  return id as string;
};

export default getUserIdFromContext;
