import db from "../../libs/db.ts";

const deleteExceptionByIdForUser = async (
  exceptionId: string,
  userId: string,
) => {
  await db.exception.delete({
    where: { id: exceptionId, userId: userId },
  });
};

export default deleteExceptionByIdForUser;
