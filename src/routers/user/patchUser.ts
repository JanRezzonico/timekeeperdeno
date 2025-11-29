import { HTTPException } from "hono/http-exception";
import { PrismaClientKnownRequestError } from "../../../prisma/generated/internal/prismaNamespace.ts";
import db from "../../libs/db.ts";
import type { PatchUserSchema } from "./index.ts";

const patchUser = async (id: string, body: PatchUserSchema) => {
  try {
    await db.user.update({
      where: { id },
      data: body,
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new HTTPException(404);
      }
    }
  }
};

export default patchUser;
