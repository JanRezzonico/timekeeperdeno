import { Hono } from "hono";
import authMiddleware, {
  AuthenticatedVariables,
} from "../../utils/middlewares/authMiddleware.ts";
import deleteUser from "./deleteUser.ts";
import userSchema from "../../schemas/userSchema.ts";
import { zValidator } from "@hono/zod-validator";
import z from "@zod/zod";
import patchUser from "./patchUser.ts";

const userRouter = new Hono<{ Variables: AuthenticatedVariables }>();

const patchSchema = userSchema.partial();

userRouter.use("*", authMiddleware);

userRouter.get("/", (c) => {
  const user = c.get("user");
  return c.json({ ...user, passwordHash: undefined, id: undefined });
});

userRouter.patch("/", zValidator("json", patchSchema), async (c) => {
  const { id } = c.get("user");
  const body = c.req.valid("json");
  await patchUser(id, body);
  return c.status(204);
});

userRouter.delete("/", async (c) => {
  const { id } = c.get("user");
  await deleteUser(id);
  return c.status(204);
});

export default userRouter;

export type PatchUserSchema = z.infer<typeof patchSchema>;
