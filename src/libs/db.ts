import { PrismaClient } from "prismaclient";
import { PrismaPg } from "@prisma/adapter-pg";

const db = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: Deno.env.get("DATABASE_URL")!,
  }),
});

await db.$connect(); // Explicitly ensure the connection is established

export default db;
