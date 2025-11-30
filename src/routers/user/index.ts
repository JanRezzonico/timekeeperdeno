import { Hono } from "hono";
import authMiddleware, {
  AuthenticatedVariables,
} from "../../utils/middlewares/authMiddleware.ts";
import deleteUser from "./deleteUser.ts";
import userSchema from "../../schemas/userSchema.ts";
import { zValidator } from "@hono/zod-validator";
import z from "@zod/zod";
import patchUser from "./patchUser.ts";
import { deleteEmailVerificationToken } from "../../libs/redis.ts";

const userRouter = new Hono<{ Variables: AuthenticatedVariables }>();

const patchSchema = userSchema.partial();

userRouter.use("*", authMiddleware);

userRouter.get("/", (c) => {
  const user = c.get("user");
  return c.json({ ...user, passwordHash: undefined, id: undefined });
});

userRouter.patch("/", zValidator("json", patchSchema), async (c) => {
  const { id, email } = c.get("user");
  const body = c.req.valid("json");
  const isChangingEmail = !!body.email && body.email !== email;
  console.log("Is changing email:", isChangingEmail);
  await patchUser(id, body, isChangingEmail);
  if (isChangingEmail) {
    await deleteEmailVerificationToken(id, email);
  }
  return c.json({ message: "Success" });
});

userRouter.delete("/", async (c) => {
  const { id } = c.get("user");
  await deleteUser(id);
  return c.json({ message: "Success" });
});

export default userRouter;

export type PatchUserSchema = z.infer<typeof patchSchema>;
