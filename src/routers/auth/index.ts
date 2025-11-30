import { Hono } from "hono";
import login from "./login.ts";
import createUser from "./createUser.ts";
import z from "@zod/zod";
import { zValidator } from "@hono/zod-validator";
import { sign } from "../../libs/jwt.ts";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import userSchema from "../../schemas/userSchema.ts";
import cookies from "../../libs/cookies.ts";
import { createRefreshToken, deleteRefreshToken } from "../../libs/redis.ts";
import authMiddleware from "../../utils/middlewares/authMiddleware.ts";
import { HTTPException } from "hono/http-exception";
import sendVerificationEmail from "./sendVerificationEmail.ts";
import verifyEmail from "./verifyEmail.ts";

const authRouter = new Hono();

const loginSchema = z.object({
  email: z.email(),
  password: z.string().nonempty(),
});
const signupSchema = userSchema;
const emailVerificationQuerySchema = z.object({
  token: z.string().nonempty(),
  email: z.email(),
});

authRouter.post("/login", zValidator("json", loginSchema), async (c) => {
  const body = c.req.valid("json");
  const user = await login(body);
  const jwt = await sign(user.id);
  const refreshToken = createRefreshToken(user.id);

  setCookie(c, cookies.jwt.name, jwt, cookies.jwt.options);
  setCookie(
    c,
    cookies.refreshToken.name,
    refreshToken,
    cookies.refreshToken.options
  );

  return c.json({ message: "Login successful" });
});

authRouter.post("/logout", (c) => {
  deleteCookie(c, cookies.jwt.name);
  const refreshToken = getCookie(c, cookies.refreshToken.name);
  if (refreshToken) deleteRefreshToken(refreshToken);
  deleteCookie(c, cookies.refreshToken.name);
  return c.json({ message: "Logout successful" });
});

authRouter.post("/signup", zValidator("json", signupSchema), async (c) => {
  const body = c.req.valid("json");
  const user = await createUser(body);
  const jwt = await sign(user.id);
  const refreshToken = createRefreshToken(user.id);

  setCookie(c, cookies.jwt.name, jwt, cookies.jwt.options);
  setCookie(
    c,
    cookies.refreshToken.name,
    refreshToken,
    cookies.refreshToken.options
  );

  return c.json({ message: "Signup successful" });
});

authRouter.post("/verify-email", authMiddleware, async (c) => {
  const { id, email, emailVerified } = c.get("user");
  if (emailVerified) {
    throw new HTTPException(400, { message: "Email already verified" });
  }
  await sendVerificationEmail(id, email);
  console.log("Verification email sent to:", email);
  return c.body(null, 204);
});

authRouter.get(
  "/verify-email/confirm",
  zValidator("query", emailVerificationQuerySchema),
  async (c) => {
    const { token, email } = c.req.valid("query");
    await verifyEmail(token, email);
    return c.body(null, 204);
  }
);

export default authRouter;

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
