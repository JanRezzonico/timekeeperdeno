import { Hono } from "hono";
import login from "./login.ts";
import createUser from "./createUser.ts";
import z from "@zod/zod";
import { zValidator } from "@hono/zod-validator";
import { sign } from "../../libs/jwt.ts";
import { deleteCookie, setCookie } from "hono/cookie";
import userSchema from "../../schemas/userSchema.ts";
import cookies from "../../libs/cookies.ts";

const authRouter = new Hono();

const loginSchema = z.object({
  email: z.email(),
  password: z.string().nonempty(),
});
const signupSchema = userSchema;

authRouter.post("/login", zValidator("json", loginSchema), async (c) => {
  const body = c.req.valid("json");
  const user = await login(body);
  const jwt = await sign(user.id);

  setCookie(c, cookies.jwt.name, jwt, cookies.jwt.options);

  return c.json({ message: "Login successful" });
});

authRouter.post("/logout", (c) => {
  deleteCookie(c, "prova123");
  return c.json({ message: "Logout successful" });
});

authRouter.post("/signup", zValidator("json", signupSchema), async (c) => {
  const body = c.req.valid("json");
  const user = await createUser(body);
  const jwt = await sign(user.id);

  setCookie(c, cookies.jwt.name, jwt, cookies.jwt.options);

  return c.json({ message: "Signup successful" });
});

// Auth routes do not need to be protected by authMiddleware

export default authRouter;

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
