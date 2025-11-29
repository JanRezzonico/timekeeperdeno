import { createClient } from "redis";
import { env } from "./env.ts";
import { randomBytes } from "node:crypto";

const redis = createClient({
  url: env.REDIS_URL,
});

await redis.connect();

const createRefreshToken = (userId: string) => {
  const token = randomBytes(32).toString("hex");
  redis.set(`refresh_token:${token}`, userId, {
    expiration: {
      type: "EX",
      value: env.REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60,
    },
  });
  return token;
};

const consumeRefreshToken = async (token: string) => {
  const userId = await redis.get(`refresh_token:${token}`);
  if (userId) {
    await redis.del(`refresh_token:${token}`); // Delete the consumed token
    const newToken = createRefreshToken(userId); // Create a new refresh token
    return {
      userId,
      newToken,
    };
  }
  return null;
};

const deleteRefreshToken = async (token: string) => {
  await redis.del(`refresh_token:${token}`);
};

export default redis;

export { createRefreshToken, consumeRefreshToken, deleteRefreshToken };
