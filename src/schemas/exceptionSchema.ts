import z from "@zod/zod";
import { endOfDay, startOfDay } from "date-fns";

const exceptionSchema = z
  .object({
    start: z.iso
      .date()
      .transform((dateString) => startOfDay(new Date(dateString))),
    end: z.iso.date().transform((dateString) => endOfDay(new Date(dateString))),
    type: z.string().trim().max(64),
    note: z.string().trim().max(512).default(""),
  })
  .refine((data) => data.end >= data.start, {
    message: "End date must be after start date",
    path: ["end"],
  });

export default exceptionSchema;
