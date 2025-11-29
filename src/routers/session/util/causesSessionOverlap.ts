import db from "../../../libs/db.ts";

/**
 * Checks if a new session with the given start and end dates would overlap with existing sessions for the user.
 *
 * Overlap is defined as any time period where two sessions intersect, including:
 *   - The new session starts during an existing session.
 *   - The new session ends during an existing session.
 *   - The new session completely contains an existing session.
 *   - Any session that is ongoing (`end === null`) overlaps with another ongoing session or
 *     a session that starts before the ongoing session.
 *
 * For ongoing sessions (`end === null`), they are considered to extend indefinitely into the future.
 *
 *
 * @param start - session start date
 * @param end - session end date, or null if ongoing
 * @param userId - ID of the user
 * @param selfSessionId - ID of the session to exclude from overlap check (useful when updating a session)
 * @returns `true` if the new session overlaps with any existing sessions, false otherwise
 */
const causesSessionOverlap = async (
  start: Date,
  end: Date | null,
  userId: string,
  selfSessionId?: string
) => {
  const virtualEnd = end ?? getMaxDate();
  const existingSessions = await db.session.findMany({
    where: {
      userId,
      ...(selfSessionId ? { NOT: { id: selfSessionId } } : {}),
      OR: [
        {
          end: null, // ongoing sessions
        },
        {
          end: {
            gt: start, // sessions that end after the new session starts
          },
        },
      ],
    },
  });
  // Check for overlap, done in js to make things simpler
  return existingSessions.some((session) => {
    const sessionEnd = session.end ?? getMaxDate();
    return start < sessionEnd && session.start < virtualEnd;
  });
};

const getMaxDate = () => new Date(8640000000000000);

export default causesSessionOverlap;
