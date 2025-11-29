import { jwt } from "hono/jwt";
import { env } from "../../libs/env.ts";
import cookies from "../../libs/cookies.ts";

const authMiddleware = jwt({
  secret: env.JWT_SECRET,
  cookie: cookies.jwt.name,
});

export default authMiddleware;
