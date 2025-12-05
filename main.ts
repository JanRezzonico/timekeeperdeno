import { Hono } from "hono";
export { default as appDb } from "./src/libs/db.ts";
import authRouter from "./src/routers/auth/index.ts";
import userRouter from "./src/routers/user/index.ts";
import sessionRouter from "./src/routers/session/index.ts";
import exceptionRouter from "./src/routers/exception/index.ts";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Welcome to the Timekeeper API" });
});

app.route("/auth", authRouter);

app.route("/user", userRouter);

app.route("/session", sessionRouter);

app.route("/exception", exceptionRouter);

// Do not run the server if this module is being imported (e.g., during tests)
if (import.meta.main) {
  Deno.serve(app.fetch);
}

export { app }; // Export app and db for testing purposes
