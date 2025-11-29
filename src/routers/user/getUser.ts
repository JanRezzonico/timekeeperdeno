import { HTTPException } from "hono/http-exception";
import db from "../../libs/db.ts";

const getUser = async (id: string) => {
  const user = await db.user.findUnique({
    where: { id },
  });

  if (!user) throw new HTTPException(404);

  return user;
};
export default getUser;
