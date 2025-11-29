import { Hono } from "hono";
import db from "./src/libs/db.ts";
import authRouter from "./src/routers/auth/index.ts";
import userRouter from "./src/routers/user/index.ts";

const app = new Hono();

app.route("/auth", authRouter);

app.route("/user", userRouter);

// Do not run the server if this module is being imported (e.g., during tests)
if (import.meta.main) {
  Deno.serve(app.fetch);
}

export { app, db }; // Export app and db for testing purposes
