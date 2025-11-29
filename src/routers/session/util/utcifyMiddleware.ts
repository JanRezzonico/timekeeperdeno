import { MiddlewareHandler } from "hono";
import { AuthenticatedVariables } from "../../../utils/middlewares/authMiddleware.ts";
import { toZonedTime } from "date-fns-tz/toZonedTime";

const utcifyMiddleware: MiddlewareHandler<{
  Variables: AuthenticatedVariables;
}> = async (c, next) => {
  const body = await c.req.json();
  const { timezone } = c.get("user");
  c.req.addValidatedData("json", {
    ...body,
    start: toZonedTime(body.start, timezone),
    end: body.end ? toZonedTime(body.end, timezone) : null,
  });
  await next();
};

export default utcifyMiddleware;
