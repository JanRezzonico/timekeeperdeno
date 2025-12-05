import db from "../../libs/db.ts";
import { CreateExceptionSchema } from "./index.ts";

const createExceptionForUser = async (
  body: CreateExceptionSchema,
  userId: string,
) => {
  const created = await db.exception.create({
    data: {
      ...body,
      userId,
    },
  });
  return created;
};

export default createExceptionForUser;
