import { createClient } from "redis";
import { env } from "./env.ts";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

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

const createEmailVerificationToken = async (userId: string, email: string) => {
  const tokenKey = `email_verification_token:${userId}-${email}`;

  // Delete existing token if any
  if (await redis.get(tokenKey)) {
    console.log("Existing token found, deleting it.");
    await redis.del(tokenKey);
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = await bcrypt.hash(token, 10);
  const tokenValue = tokenHash;
  await redis.set(tokenKey, tokenValue, {
    expiration: {
      type: "EX",
      value: env.EMAIL_VERIFICATION_TOKEN_EXPIRATION_HOURS * 60 * 60,
    },
  });
  return token;
};

const consumeEmailVerificationToken = async (
  userId: string,
  email: string,
  token: string
) => {
  const tokenKey = `email_verification_token:${userId}-${email}`;
  const tokenHash = await redis.get(tokenKey);
  if (tokenHash && (await bcrypt.compare(token, tokenHash))) {
    await redis.del(tokenKey); // Delete the consumed token
    return { userId, email };
  }
  return null;
};

const deleteEmailVerificationToken = async (userId: string, email: string) => {
  const tokenKey = `email_verification_token:${userId}-${email}`;
  await redis.del(tokenKey);
};

export default redis;

export {
  createRefreshToken,
  consumeRefreshToken,
  deleteRefreshToken,
  createEmailVerificationToken,
  consumeEmailVerificationToken,
  deleteEmailVerificationToken,
};
