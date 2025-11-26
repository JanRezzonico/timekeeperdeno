import { assertEquals } from "@std/assert";
import { app, db } from "./main.ts";

Deno.test("simple test", () => {
  assertEquals(1 + 1, 2);
});

Deno.test("Connection test", async () => {
  const res = await app.request("/");
  assertEquals(res.status, 200);
});

Deno.test("Prova endpoint test", async () => {
  const res = await app.request("/prova");
  assertEquals(res.status, 200);
  const data = await res.json();
  assertEquals(Array.isArray(data.users), true);
});

Deno.test.afterEach(async () => {
  await db.$disconnect();
});
