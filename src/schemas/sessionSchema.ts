import z from "@zod/zod";
import { addMinutes, startOfMinute } from "date-fns";

const floorToMinute = (date: Date) => startOfMinute(date);

const ceilToMinute = (date: Date) =>
  date.getSeconds() === 0 && date.getMilliseconds() === 0
    ? date
    : addMinutes(startOfMinute(date), 1);

const sessionSchema = z
  .object({
    start: z.coerce.date().transform(floorToMinute),
    end: z.coerce
      .date()
      .nullable()
      .transform((date) => (date ? ceilToMinute(date) : null)),
    note: z.string().trim().max(512).default(""),
  })
  .refine((data) => data.end === null || data.end >= data.start, {
    message: "End date must be either null or after start date",
    path: ["end"],
  });

export default sessionSchema;
