import { HTTPException } from "hono/http-exception";
import { PrismaClientKnownRequestError } from "../../../prisma/generated/internal/prismaNamespace.ts";
import db from "../../libs/db.ts";
import type { PatchUserSchema } from "./index.ts";
import bcrypt from "bcryptjs";

const patchUser = async (
  id: string,
  body: PatchUserSchema,
  isChangingEmail: boolean,
) => {
  try {
    const passwordHash = body.password
      ? await bcrypt.hash(body.password, 10)
      : undefined;
    const emailVerified = isChangingEmail ? false : undefined;
    const data = { ...body, password: undefined, passwordHash, emailVerified };
    const res = await db.user.update({
      where: { id },
      data,
    });
    console.log("User updated:", res);
  } catch (e) {
    console.error("Error updating user:", e);
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new HTTPException(404);
      }
    }
    throw e;
  }
};

export default patchUser;
