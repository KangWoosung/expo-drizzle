import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tags } from "../db/drizzle/schema";
import { z } from "zod";

export const selectTagSchema = createSelectSchema(tags);

export const baseInsertTagSchema = createInsertSchema(tags);

export const insertTagsSchema = baseInsertTagSchema
  .required({
    id: true,
    name: true,
  })
  .extend({
    name: z.string().min(1),
  });

export type SelectTagsSchemaType = z.infer<typeof selectTagSchema>;
export type InsertTagsSchemaType = z.infer<typeof insertTagsSchema>;

export const apiTagSchema = z.object({
  name: z.string(),
  count: z.number().optional(),
});

export type ApiTagSchemaType = z.infer<typeof apiTagSchema>;
