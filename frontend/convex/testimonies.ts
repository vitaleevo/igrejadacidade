import { ConvexError, v } from "convex/values";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { CATEGORIES } from "./schema";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_MIME_IMAGE = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_MIME_VIDEO = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

function requireAdmin(adminKey: string) {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) {
    throw new ConvexError({ code: 503, message: "Moderation not configured." });
  }
  if (adminKey !== expected) {
    throw new ConvexError({ code: 401, message: "Invalid admin credentials." });
  }
}

function validateSubmit(args: {
  fullName: string;
  phone?: string;
  email?: string;
  story: string;
  happenedAt?: string;
  category: string;
  allowContact: boolean;
  publicationConsent: string;
  ageConfirm: boolean;
}) {
  const fullName = args.fullName.trim();
  if (fullName.length < 2 || fullName.length > 255) {
    throw new ConvexError({ code: 422, message: "Please enter your full name." });
  }
  const story = args.story.trim();
  if (story.length < 20 || story.split(/\s+/).length < 5) {
    throw new ConvexError({
      code: 422,
      message: "Please share your story in detail (20+ characters, 5+ words).",
    });
  }
  if (args.email && !EMAIL_RE.test(args.email.trim())) {
    throw new ConvexError({ code: 422, message: "Please enter a valid email." });
  }
  if (!(CATEGORIES as readonly string[]).includes(args.category)) {
    throw new ConvexError({ code: 422, message: "Invalid category." });
  }
  if (args.publicationConsent !== "publish" && args.publicationConsent !== "internal") {
    throw new ConvexError({ code: 422, message: "Please choose how your testimony may be used." });
  }
  if (args.ageConfirm !== true) {
    throw new ConvexError({
      code: 422,
      message: "Please confirm you are 18 or older, or that your guardian authorizes this submission.",
    });
  }
  return { fullName, story };
}

type PublicTestimony = {
  id: string;
  fullName: string;
  story: string;
  happenedAt?: string;
  category: string;
  mediaUrl: string | null;
  mediaType?: "image" | "video";
  createdAt: number;
};

async function toPublic(
  ctx: QueryCtx | MutationCtx,
  doc: Doc<"testimonies">
): Promise<PublicTestimony> {
  let mediaUrl: string | null = null;
  if (doc.mediaStorageId) {
    mediaUrl = await ctx.storage.getUrl(doc.mediaStorageId);
  }
  return {
    id: doc._id,
    fullName: doc.fullName,
    story: doc.story,
    happenedAt: doc.happenedAt,
    category: doc.category,
    mediaUrl,
    mediaType: doc.mediaType,
    createdAt: doc.createdAt,
  };
}

/** Short-lived upload URL — client PUTs the file directly to Convex storage. */
export const generateUploadUrl = mutation({
  args: {
    contentType: v.string(),
    sizeBytes: v.number(),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const isImage = ALLOWED_MIME_IMAGE.includes(args.contentType);
    const isVideo = ALLOWED_MIME_VIDEO.includes(args.contentType);
    if (!isImage && !isVideo) {
      throw new ConvexError({ code: 400, message: "File type not allowed." });
    }
    const max = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (args.sizeBytes <= 0 || args.sizeBytes > max) {
      throw new ConvexError({ code: 400, message: "File too large." });
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const submit = mutation({
  args: {
    fullName: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    story: v.string(),
    happenedAt: v.optional(v.string()),
    category: v.string(),
    mediaStorageId: v.optional(v.id("_storage")),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
    allowContact: v.boolean(),
    publicationConsent: v.string(),
    ageConfirm: v.boolean(),
  },
  returns: v.object({ id: v.string() }),
  handler: async (ctx, args) => {
    const { fullName, story } = validateSubmit(args);
    if (args.mediaStorageId) {
      const meta = await ctx.db.system.get(args.mediaStorageId);
      if (!meta) {
        throw new ConvexError({ code: 400, message: "Attachment not found. Upload again." });
      }
      // Verificação servidor: tipo e tamanho REAIS do ficheiro, não os declarados.
      const sys = meta as unknown as { contentType?: unknown; size?: unknown; sha256?: unknown };
      const realType = typeof sys.contentType === "string" ? sys.contentType : null;
      const realSize = typeof sys.size === "number" ? sys.size : null;
      const expectedKind = args.mediaType ?? (realType?.startsWith("image/") ? "image" : realType?.startsWith("video/") ? "video" : null);
      const maxBytes =
        expectedKind === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
      const typeOk =
        realType === null ||
        ALLOWED_MIME_IMAGE.includes(realType) ||
        ALLOWED_MIME_VIDEO.includes(realType);
      const kindOk =
        !args.mediaType ||
        realType === null ||
        (args.mediaType === "image" ? realType.startsWith("image/") : realType.startsWith("video/"));
      if (!typeOk || !kindOk || (realSize !== null && (realSize <= 0 || realSize > maxBytes))) {
        try {
          await ctx.storage.delete(args.mediaStorageId);
        } catch {
          /* já ausente */
        }
        throw new ConvexError({ code: 400, message: "Attachment rejected: type or size not allowed." });
      }
    }
    const now = Date.now();
    const id = await ctx.db.insert("testimonies", {
      fullName,
      phone: args.phone?.trim() || undefined,
      email: args.email?.trim() || undefined,
      story,
      happenedAt: args.happenedAt?.trim() || undefined,
      category: args.category,
      mediaStorageId: args.mediaStorageId,
      mediaType: args.mediaType,
      allowContact: args.allowContact,
      publicationConsent: args.publicationConsent as "publish" | "internal",
      ageConfirmed: true,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
    return { id };
  },
});

export const listPublic = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 20, 1), 100);
    let q = ctx.db
      .query("testimonies")
      .withIndex("by_status", (i) => i.eq("status", "approved"))
      .order("desc");
    if (args.category) {
      q = ctx.db
        .query("testimonies")
        .withIndex("by_status_category", (i) =>
          i.eq("status", "approved").eq("category", args.category as string)
        )
        .order("desc");
    }
    const docs = await q.take(limit * 2);
    const out: PublicTestimony[] = [];
    for (const doc of docs) {
      if (doc.publicationConsent !== "publish") continue;
      out.push(await toPublic(ctx, doc));
      if (out.length >= limit) break;
    }
    return out;
  },
});

export const getPublic = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    let doc: Doc<"testimonies"> | null = null;
    try {
      doc = await ctx.db.get(args.id as Id<"testimonies">);
    } catch {
      doc = null;
    }
    if (!doc || doc.status !== "approved" || doc.publicationConsent !== "publish") {
      throw new ConvexError({ code: 404, message: "Testimony not publicly available." });
    }
    return await toPublic(ctx, doc);
  },
});

export const adminList = query({
  args: {
    adminKey: v.string(),
    status: v.optional(
      v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminKey);
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 100);
    const docs = args.status
      ? await ctx.db
          .query("testimonies")
          .withIndex("by_status", (i) =>
            i.eq("status", args.status as "pending" | "approved" | "rejected")
          )
          .order("desc")
          .take(limit)
      : await ctx.db.query("testimonies").order("desc").take(limit);
    return Promise.all(
      docs.map(async (doc) => ({
        ...(await toPublic(ctx, doc)),
        phone: doc.phone ?? null,
        email: doc.email ?? null,
        allowContact: doc.allowContact,
        publicationConsent: doc.publicationConsent,
        status: doc.status,
        moderatedAt: doc.moderatedAt ?? null,
      }))
    );
  },
});

export const moderate = mutation({
  args: {
    adminKey: v.string(),
    id: v.string(),
    status: v.optional(
      v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))
    ),
    publicationConsent: v.optional(v.union(v.literal("publish"), v.literal("internal"))),
    ip: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminKey);
    const doc = await ctx.db.get(args.id as Id<"testimonies">);
    if (!doc) {
      throw new ConvexError({ code: 404, message: "Testimony not found." });
    }
    const patch: Partial<Doc<"testimonies">> & { updatedAt: number } = {
      updatedAt: Date.now(),
    };
    if (args.status && args.status !== doc.status) {
      (patch as { status: typeof args.status }).status = args.status;
      patch.moderatedAt = Date.now();
      await ctx.db.insert("audit_logs", {
        action: `testimony.${args.status}`,
        testimonyId: doc._id,
        actor: "admin-key",
        ip: args.ip,
        oldValue: doc.status,
        newValue: args.status,
        createdAt: Date.now(),
      });
    }
    if (args.publicationConsent && args.publicationConsent !== doc.publicationConsent) {
      (patch as { publicationConsent: typeof args.publicationConsent }).publicationConsent =
        args.publicationConsent;
      await ctx.db.insert("audit_logs", {
        action: "testimony.consent_updated",
        testimonyId: doc._id,
        actor: "admin-key",
        ip: args.ip,
        oldValue: doc.publicationConsent,
        newValue: args.publicationConsent,
        createdAt: Date.now(),
      });
    }
    await ctx.db.patch(doc._id, patch);
    const updated = await ctx.db.get(doc._id);
    if (!updated) throw new ConvexError({ code: 404, message: "Testimony not found." });
    const pub = await toPublic(ctx, updated);
    return {
      ...pub,
      phone: updated.phone ?? null,
      email: updated.email ?? null,
      allowContact: updated.allowContact,
      publicationConsent: updated.publicationConsent,
      status: updated.status,
      moderatedAt: updated.moderatedAt ?? null,
    };
  },
});

export const auditList = query({  args: { adminKey: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    requireAdmin(args.adminKey);
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 200);
    const rows = await ctx.db.query("audit_logs").order("desc").take(limit);
    return rows.map((r) => ({
      id: r._id,
      action: r.action,
      testimony_id: r.testimonyId ?? null,
      actor: r.actor,
      ip: r.ip ?? null,
      old_value: r.oldValue ?? null,
      new_value: r.newValue ?? null,
      created_at: r.createdAt,
    }));
  },
});
