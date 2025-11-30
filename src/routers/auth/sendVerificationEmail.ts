import { createEmailVerificationToken } from "../../libs/redis.ts";

const sendVerificationEmail = async (userId: string, email: string) => {
  const token = await createEmailVerificationToken(userId, email);
  const link = `http://localhost:8000/auth/verify-email/confirm?token=${token}&email=${encodeURIComponent(
    email
  )}`;
  //TODO replace with actual email sending logic
  console.log(`Email verification link: ${link}`);
};

export default sendVerificationEmail;
