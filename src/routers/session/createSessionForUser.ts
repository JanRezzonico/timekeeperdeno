import { HTTPException } from "hono/http-exception";
import db from "../../libs/db.ts";
import { CreateSessionSchema } from "./index.ts";
import causesSessionOverlap from "./util/causesSessionOverlap.ts";
import splitIntoMultipleSessions from "./util/splitIntoMultipleSessions.ts";

const createSessionForUser = async (
  body: CreateSessionSchema,
  userId: string,
) => {
  const { start, end } = body;
  const causesOverlap = await causesSessionOverlap(start, end, userId);
  if (causesOverlap) {
    throw new HTTPException(409, {
      message: "Session overlaps with an existing session",
    });
  }

  const sessions = splitIntoMultipleSessions(body);

  const { count } = await db.session.createMany({
    data: sessions.map((session) => ({
      ...session,
      userId,
    })),
  });

  if (count === 0) {
    throw new HTTPException(500, {
      message: "Failed to create session",
    });
  }

  return count;
};

export default createSessionForUser;
