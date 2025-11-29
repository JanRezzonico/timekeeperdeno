import { HTTPException } from "hono/http-exception";
import db from "../../libs/db.ts";
import { PatchSessionSchema } from "./index.ts";
import causesSessionOverlap from "./util/causesSessionOverlap.ts";

const patchSessionForUser = async (
  sessionId: string,
  body: PatchSessionSchema,
  userId: string,
) => {
  const { start, end } = body;
  const existingResource = await db.session.findUnique({
    where: { id: sessionId, userId: userId },
  });
  if (!existingResource) {
    throw new HTTPException(404);
  }

  const actualStart = start || existingResource.start;
  const actualEnd = end && end === null ? end : existingResource.end;

  const causesOverlap = await causesSessionOverlap(
    actualStart,
    actualEnd,
    userId,
    sessionId,
  );

  if (causesOverlap) {
    throw new HTTPException(409, {
      message: "Session overlaps with an existing session",
    });
  }

  await db.session.update({
    where: { id: sessionId, userId: userId },
    data: body,
  });
};

export default patchSessionForUser;
