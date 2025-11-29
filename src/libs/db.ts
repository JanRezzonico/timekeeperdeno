import { PrismaClient } from "prismaclient";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env.ts";

const db = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: env.DATABASE_URL,
  }),
});

await db.$connect(); // Explicitly ensure the connection is established

export default db;
