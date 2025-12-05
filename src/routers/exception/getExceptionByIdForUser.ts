import { HTTPException } from "hono/http-exception";
import db from "../../libs/db.ts";

const getExceptionByIdForUser = async (exceptionId: string, userId: string) => {
  const exception = await db.exception.findUnique({
    where: { id: exceptionId },
  });
  if (!exception) throw new HTTPException(404);
  if (exception.userId !== userId) throw new HTTPException(403);
  return exception;
};

export default getExceptionByIdForUser;
