import bcrypt from "bcryptjs";
import db from "../../libs/db.ts";
import { SignupSchema } from "./index.ts";
import { HTTPException } from "hono/http-exception";
import { PrismaClientKnownRequestError } from "../../../prisma/generated/internal/prismaNamespace.ts";

const createUser = async (body: SignupSchema) => {
  const passwordHash = await bcrypt.hash(body.password, 10);
  const data = { ...body, password: undefined, passwordHash };
  try {
    const user = await db.user.create({
      data,
    });
    return user;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new HTTPException(409);
      }
    }
    throw e;
  }
};

export default createUser;
