import { HTTPException } from "hono/http-exception";
import db from "../../libs/db.ts";

const getSessionByIdForUser = async (sessionId: string, userId: string) => {
  const session = await db.session.findUnique({
    where: { id: sessionId },
  });
  if (!session) throw new HTTPException(404);
  if (session.userId !== userId) throw new HTTPException(403);
  return session;
};

export default getSessionByIdForUser;
