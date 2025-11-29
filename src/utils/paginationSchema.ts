import z from "@zod/zod";

// TODO maybe set default preference in user settings? or maybe just store it in the frontend and send that value with each request
const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
});

export default paginationSchema;
