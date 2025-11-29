import { Session } from "prismaclient";
import { fromZonedTime } from "date-fns-tz";

const prepareSession = (session: Session, timezone: string) => {
  const stripped = {
    id: session.id,
    note: session.note,
    start: session.start,
    end: session.end,
  };
  const standardized = {
    ...stripped,
    start: fromZonedTime(stripped.start, timezone),
    end: stripped.end ? fromZonedTime(stripped.end, timezone) : null,
  };
  return standardized;
};

export default prepareSession;
