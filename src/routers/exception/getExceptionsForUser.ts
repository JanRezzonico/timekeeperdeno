import db from "../../libs/db.ts";

const getExceptionsForUser = async (
  userId: string,
  page: number,
  pageSize: number,
) => {
  const sessions = await db.exception.findMany({
    where: { userId },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  return sessions;
};

export default getExceptionsForUser;
