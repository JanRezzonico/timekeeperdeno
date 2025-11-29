import { Hono } from "hono";
import authMiddleware from "../../utils/middlewares/authMiddleware.ts";
import { JwtVariables } from "hono/jwt";
import getUser from "./getUser.ts";
import { HTTPException } from "hono/http-exception";
import deleteUser from "./deleteUser.ts";
import getUserIdFromContext from "../../utils/getUserIdFromContext.ts";
import userSchema from "../../schemas/userSchema.ts";
import { zValidator } from "@hono/zod-validator";
import z from "@zod/zod";
import patchUser from "./patchUser.ts";

const userRouter = new Hono<{ Variables: JwtVariables }>();

const patchSchema = userSchema.partial();

userRouter.use("*", authMiddleware);

userRouter.get("/", async (c) => {
  const id = getUserIdFromContext(c);
  const user = await getUser(id);
  return c.json({ ...user, passwordHash: undefined, id: undefined });
});

userRouter.patch("/", zValidator("json", patchSchema), async (c) => {
  const id = getUserIdFromContext(c);
  const body = c.req.valid("json");
  await patchUser(id, body);
  return c.status(204);
});

userRouter.delete("/", async (c) => {
  const id = getUserIdFromContext(c);
  await deleteUser(id);
  return c.status(204);
});

export default userRouter;

export type PatchUserSchema = z.infer<typeof patchSchema>;
