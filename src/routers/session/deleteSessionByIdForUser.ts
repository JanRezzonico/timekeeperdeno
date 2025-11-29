import db from "../../libs/db.ts";

const deleteSessionByIdForUser = async (sessionId: string, userId: string) => {
  await db.session.delete({
    where: { id: sessionId, userId: userId },
  });
};

export default deleteSessionByIdForUser;
