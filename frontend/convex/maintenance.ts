import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

const REJECTED_RETENTION_MS = 180 * 24 * 60 * 60 * 1000; // 180 dias
const PURGE_BATCH = 100;

/**
 * Retenção LGPD/LPDP: elimina testemunhos rejeitados há mais de 180 dias
 * (incluindo anexos), executado mensalmente via crons.ts. A eliminação é
 * definitiva; a trilha de auditoria é preservada.
 */
export const purgeRejected = internalMutation({
  args: {},
  returns: v.object({ purged: v.number() }),
  handler: async (ctx) => {
    const cutoff = Date.now() - REJECTED_RETENTION_MS;
    const docs = await ctx.db
      .query("testimonies")
      .withIndex("by_status", (i) => i.eq("status", "rejected"))
      .order("asc")
      .take(PURGE_BATCH);
    let purged = 0;
    for (const doc of docs) {
      if (doc.createdAt > cutoff) break;
      if (doc.mediaStorageId) {
        try {
          await ctx.storage.delete(doc.mediaStorageId);
        } catch {
          /* ficheiro já ausente — continua a eliminar o registo */
        }
      }
      await ctx.db.delete(doc._id);
      purged += 1;
    }
    return { purged };
  },
});
