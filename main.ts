import "dotenv/config";
import { Context, Hono } from "hono";
import db from "./src/libs/db.ts";

const app = new Hono();

app.get("/prova", async (c: Context) => {
  await db.user.create({
    data: {
      email: `user${Date.now()}@example.com`,
      name: "Example User",
      locale: "en-US",
      passwordHash: "hashedpassword",
      schedule: {},
      startedAt: new Date(),
      theme: "light",
      timezone: "UTC",
    },
  });

  const users = await db.user.findMany();
  return c.json({ users });
});

app.get("/", (c: Context) => {
  return c.text("Hello, Deno with Prisma and Hono!");
});

// Do not run the server if this module is being imported (e.g., during tests)
if (import.meta.main) {
  Deno.serve(app.fetch);
}

export { app, db }; // Export app and db for testing purposes
