import { Hono } from "hono";
import authMiddleware, {
  AuthenticatedVariables,
} from "../../utils/middlewares/authMiddleware.ts";
import exceptionSchema from "../../schemas/exceptionSchema.ts";
import paginationSchema from "../../utils/paginationSchema.ts";
import { zValidator } from "@hono/zod-validator";
import getExceptionsForUser from "./getExceptionsForUser.ts";
import prepareException from "./util/prepareException.ts";
import getExceptionByIdForUser from "./getExceptionByIdForUser.ts";
import z from "@zod/zod";
import createExceptionForUser from "./createExceptionForUser.ts";
import patchExceptionForUser from "./patchExceptionForUser.ts";
import deleteExceptionByIdForUser from "./deleteExceptionByIdForUser.ts";

const exceptionRouter = new Hono<{ Variables: AuthenticatedVariables }>();
const createExceptionSchema = exceptionSchema;
const patchExceptionSchema = exceptionSchema.partial();

// We do not care if the exception overlaps with existing exceptions,
// because what matters is that whether a day is marked as an exception or not.

exceptionRouter.use("*", authMiddleware);

exceptionRouter.get("/", zValidator("query", paginationSchema), async (c) => {
  const { id: userId } = c.get("user");
  const { page, pageSize } = c.req.valid("query");
  const exceptions = await getExceptionsForUser(userId, page, pageSize);
  const preparedExceptions = exceptions.map((exception) =>
    prepareException(exception)
  );
  return c.json(preparedExceptions);
});

exceptionRouter.get("/:id", async (c) => {
  const { id: userId } = c.get("user");
  const { id } = c.req.param();
  const exception = await getExceptionByIdForUser(id, userId);
  return c.json(prepareException(exception));
});

exceptionRouter.post(
  "/",
  zValidator("json", createExceptionSchema),
  async (c) => {
    const { id: userId } = c.get("user");
    const exceptionData = c.req.valid("json");
    await createExceptionForUser(exceptionData, userId);
    return c.json({ message: "Created" }, 201);
  },
);

exceptionRouter.patch(
  "/:id",
  zValidator("json", patchExceptionSchema),
  async (c) => {
    const { id: userId } = c.get("user");
    const { id } = c.req.param();
    const body = c.req.valid("json");
    await patchExceptionForUser(id, body, userId);
    return c.json({ message: "Success" });
  },
);

exceptionRouter.delete("/:id", async (c) => {
  const { id: userId } = c.get("user");
  const { id } = c.req.param();
  await deleteExceptionByIdForUser(id, userId);
  return c.json({ message: "Success" });
});

export default exceptionRouter;
type CreateExceptionSchema = z.infer<typeof createExceptionSchema>;
type PatchExceptionSchema = z.infer<typeof patchExceptionSchema>;
export type { CreateExceptionSchema, PatchExceptionSchema };
