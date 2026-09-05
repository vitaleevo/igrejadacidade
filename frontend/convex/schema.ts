import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const CATEGORIES = [
  "Healing",
  "Answered Prayer",
  "Employment / Finances",
  "Family / Marriage",
  "Deliverance",
  "Conversion / Salvation",
  "Miracle",
  "Other",
] as const;

export default defineSchema({
  testimonies: defineTable({
    fullName: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    story: v.string(),
    happenedAt: v.optional(v.string()),
    category: v.string(),
    mediaStorageId: v.optional(v.id("_storage")),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
    allowContact: v.boolean(),
    publicationConsent: v.union(v.literal("publish"), v.literal("internal")),
    // Opcional: só existe em registos criados após a introdução da confirmação de idade.
    ageConfirmed: v.optional(v.boolean()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    moderatedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_status_category", ["status", "category"]),

  audit_logs: defineTable({
    action: v.string(),
    testimonyId: v.optional(v.string()),
    actor: v.string(),
    ip: v.optional(v.string()),
    oldValue: v.optional(v.string()),
    newValue: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_action", ["action"]),
});
