import db from "../../libs/db.ts";

const deleteUser = async (id: string) => {
  await db.user.delete({
    where: { id },
  });
};
export default deleteUser;
