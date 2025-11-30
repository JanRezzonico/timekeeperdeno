import { assertEquals } from "@std/assert";
import { app, appDb as db } from "./main.ts";

Deno.test("Connection test", async () => {
  const res = await app.request("/");
  assertEquals(res.status, 200);
});

Deno.test.afterEach(async () => {
  await db.$disconnect();
});
