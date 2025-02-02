/*
2025-01-25 13:42:05

// Releases table
export const releases = sqliteTable("releases", {
  id: text("id").primaryKey().notNull(),
  title: text("title").notNull(),
  status: text("status"),
  releaseDate: text("release_date"),
  country: text("country").notNull(),
  disambiguation: text("disambiguation"),
  packaging: text("packaging"),
  artistId: text("artist_id").references(() => artists.id),
});

export type ApiAlbumType = {
  id: string;
  title: string;
  status: string;
  country: string;
  date: string;
  packaging: string;
  disambiguation?: string;
  asin?: string;
  quality?: string;
  barcode?: string;
  packagingId?: string;
  statusId?: string;
  artistId?: string;
};

export type ApiReleasesType = {
  releases: AlbumType[];
};
*/

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { releases } from "../db/drizzle/schema";
import { z } from "zod";

export const packagingEnum = z.enum(["CD", "LP", "DVD", "BD", "Other"]);

export const selectAlbumSchema = createSelectSchema(releases);

// 기본 스키마 생성
export const baseInsertAlbumSchema = createInsertSchema(releases);

// 필수 필드와 옵셔널 필드를 분리하여 스키마 구성
export const insertAlbumSchema = baseInsertAlbumSchema
  .required({
    id: true,
    title: true,
    artist_id: true,
  })
  .extend({
    title: z.string().min(1, "Album Title is required"),
    status: z.string().default("official"),
    release_date: z.string().nullable().optional(),
    country: z.string().default("XXA"),
    disambiguation: z.string().nullable().optional(),
    packaging: packagingEnum.default("CD"),
  });

export type InsertAlbumSchemaType = z.infer<typeof insertAlbumSchema>;
export type SelectAlbumSchemaType = z.infer<typeof selectAlbumSchema>;

// API 응답 스키마
export const apiAlbumSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  status: z.string(),
  country: z.string(),
  date: z.string(),
  packaging: z.string(),
  disambiguation: z.string().nullable(),
  asin: z.string().nullable(),
  quality: z.string().nullable(),
  barcode: z.string().nullable(),
  packagingId: z.string().nullable(),
  statusId: z.string().nullable(),
  artist_id: z.string().nullable(),
});

export type ApiAlbumSchemaType = z.infer<typeof apiAlbumSchema>;

export const apiReleasesSchema = z.object({
  releases: z.array(apiAlbumSchema),
});

export type ApiReleasesSchemaType = z.infer<typeof apiReleasesSchema>;
