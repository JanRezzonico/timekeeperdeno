import { HTTPException } from "hono/http-exception";
import db from "../../libs/db.ts";
import { consumeEmailVerificationToken } from "../../libs/redis.ts";

const verifyEmail = async (token: string, email: string) => {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new HTTPException(400, { message: "Invalid email" });
  const consumationResult = await consumeEmailVerificationToken(
    user.id,
    email,
    token,
  );
  if (!consumationResult) {
    throw new HTTPException(400, { message: "Invalid or expired token" });
  }
  await db.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });
};

export default verifyEmail;
