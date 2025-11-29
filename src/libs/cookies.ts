const cookies = {
  jwt: {
    name: "timekeeper_auth_jwt",
    options: {
      httpOnly: Deno.env.get("ENV") === "production",
      secure: Deno.env.get("ENV") === "production",
      sameSite: "Lax" as const,
    },
  },
};

export default cookies;
