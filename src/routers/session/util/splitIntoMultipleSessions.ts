import { CreateSessionSchema } from "../index.ts";
import { isSameDay, endOfDay, addDays, startOfDay } from "date-fns";

const splitIntoMultipleSessions = (session: CreateSessionSchema) => {
  if (session.end === null) return [session];
  const { start, end, note } = session;

  const sessions = [];
  let currentStart = start;

  while (!isSameDay(currentStart, end)) {
    const sessionEndOfDay = endOfDay(currentStart);
    sessions.push({
      start: currentStart,
      end: sessionEndOfDay,
      note,
    });
    // Move to the next day
    currentStart = addDays(startOfDay(currentStart), 1);
  }

  // Push the final session
  sessions.push({
    start: currentStart,
    end,
    note,
  });

  return sessions;
};

export default splitIntoMultipleSessions;
