import db from "../../libs/db.ts";

const getSessionsForUser = async (
  userId: string,
  page: number,
  pageSize: number
) => {
  const sessions = await db.session.findMany({
    where: { userId },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  return sessions;
};

export default getSessionsForUser;
