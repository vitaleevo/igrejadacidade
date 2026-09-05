import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Dia 1 de cada mês, 02:00 UTC — purga rejeitados há +180 dias (retenção).
crons.monthly(
  "purge-rejected-testimonies",
  { day: 1, hourUTC: 2, minuteUTC: 0 },
  internal.maintenance.purgeRejected
);

export default crons;
