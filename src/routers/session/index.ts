import { Hono } from "hono";
import authMiddleware, {
  AuthenticatedVariables,
} from "../../utils/middlewares/authMiddleware.ts";
import getSessionsForUser from "./getSessionsForUser.ts";
import getSessionByIdForUser from "./getSessionByIdForUser.ts";
import deleteSessionByIdForUser from "./deleteSessionByIdForUser.ts";
import { zValidator } from "@hono/zod-validator";
import sessionSchema from "../../schemas/sessionSchema.ts";
import z from "@zod/zod";
import prepareSession from "./util/prepareSession.ts";
import utcifyMiddleware from "./util/utcifyMiddleware.ts";
import createSessionForUser from "./createSessionForUser.ts";
import patchSessionForUser from "./patchSessionForUser.ts";
import paginationSchema from "../../utils/paginationSchema.ts";

const sessionRouter = new Hono<{ Variables: AuthenticatedVariables }>();
const createSessionSchema = sessionSchema;
const patchSessionSchema = sessionSchema.partial();

sessionRouter.use("*", authMiddleware);

sessionRouter.get("/", zValidator("query", paginationSchema), async (c) => {
  const { id: userId, timezone } = c.get("user");
  const { page, pageSize } = c.req.valid("query");
  const sessions = await getSessionsForUser(userId, page, pageSize);
  const preparedSessions = sessions.map((session) =>
    prepareSession(session, timezone)
  );
  return c.json(preparedSessions);
});

sessionRouter.get("/:id", async (c) => {
  const { id: userId, timezone } = c.get("user");
  const { id } = c.req.param();
  const session = await getSessionByIdForUser(id, userId);
  const preparedSession = prepareSession(session, timezone);
  return c.json(preparedSession);
});

sessionRouter.post(
  "/",
  zValidator("json", createSessionSchema),
  utcifyMiddleware,
  async (c) => {
    const { id: userId } = c.get("user");
    const body = c.req.valid("json");
    const count = await createSessionForUser(body, userId);
    return c.json({ count });
  },
);

sessionRouter.patch(
  "/:id",
  zValidator("json", patchSessionSchema),
  utcifyMiddleware,
  async (c) => {
    const { id: userId } = c.get("user");
    const { id } = c.req.param();
    const body = c.req.valid("json");
    await patchSessionForUser(id, body, userId);
    return c.json({ message: "Success" });
  },
);

sessionRouter.delete("/:id", async (c) => {
  const { id: userId } = c.get("user");
  const { id } = c.req.param();
  await deleteSessionByIdForUser(id, userId);
  return c.json({ message: "Success" });
});

export default sessionRouter;

export type CreateSessionSchema = z.infer<typeof createSessionSchema>;
export type PatchSessionSchema = z.infer<typeof patchSessionSchema>;
