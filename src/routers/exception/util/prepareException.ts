import { Exception } from "prismaclient";
import { format } from "date-fns";

const prepareException = (exception: Exception) => {
  const stripped = {
    id: exception.id,
    notes: exception.notes,
    type: exception.type,
    start: exception.start,
    end: exception.end,
  };
  const standardized = {
    ...stripped,
    start: format(stripped.start, "yyyy-MM-dd"),
    end: format(stripped.end, "yyyy-MM-dd"),
  };
  return standardized;
};

export default prepareException;
