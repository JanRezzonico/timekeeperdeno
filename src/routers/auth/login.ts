import { HTTPException } from "hono/http-exception";
import { LoginSchema } from "./index.ts";
import db from "../../libs/db.ts";
import { User } from "prismaclient";
import bcrypt from "bcryptjs";

const login = async ({ email, password }: LoginSchema): Promise<User> => {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    throw new HTTPException(401);
  }
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new HTTPException(401);
  }
  return user;
};

export default login;
