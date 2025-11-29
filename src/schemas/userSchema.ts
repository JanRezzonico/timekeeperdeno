import z from "@zod/zod";

const passwordSchema = z.string().refine((val) => {
  const hasMinLength = val.length >= 8;
  const hasMaxLength = val.length <= 256;
  const hasUpperCase = /[A-Z]/.test(val);
  const hasLowerCase = /[a-z]/.test(val);
  const hasNumber = /\d/.test(val);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(val);
  return (
    hasMinLength &&
    hasMaxLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  );
});

const themeSchema = z.enum(["light", "dark"]);

const timezoneSchema = z.string().refine((val) => {
  const timeZones = new Set(Intl.supportedValuesOf("timeZone"));
  return timeZones.has(val);
});

const localeSchema = z.enum(["en", "it"]);

const scheduleSchema = z.object({
  monday: z.coerce.number().min(0).max(1440),
  tuesday: z.coerce.number().min(0).max(1440),
  wednesday: z.coerce.number().min(0).max(1440),
  thursday: z.coerce.number().min(0).max(1440),
  friday: z.coerce.number().min(0).max(1440),
  saturday: z.coerce.number().min(0).max(1440),
  sunday: z.coerce.number().min(0).max(1440),
});

const userSchema = z.object({
  email: z.email(),
  password: passwordSchema,
  name: z.string().min(1).max(32),
  theme: themeSchema,
  startedAt: z.coerce.date(),
  timezone: timezoneSchema,
  locale: localeSchema,
  schedule: scheduleSchema,
});

export default userSchema;
