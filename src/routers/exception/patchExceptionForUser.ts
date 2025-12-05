import db from "../../libs/db.ts";
import { PatchExceptionSchema } from "./index.ts";

const patchExceptionForUser = async (
  exceptionId: string,
  body: PatchExceptionSchema,
  userId: string,
) => {
  await db.exception.update({
    where: { id: exceptionId, userId: userId },
    data: body,
  });
};

export default patchExceptionForUser;
