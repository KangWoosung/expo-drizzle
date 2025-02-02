// /src/db/drizzle/schema.ts
import {
  text,
  integer,
  sqliteTable,
  primaryKey,
  index,
} from "drizzle-orm/sqlite-core";

import { artistTypeEnum, artistTypeEnumArray } from "@/zod-schemas/artists";
import { packagingEnum } from "@/zod-schemas/albums";

// Artists table
export const artists = sqliteTable(
  "artists",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    sortName: text("sort_name")!,
    type: text("type", { enum: artistTypeEnumArray }).default("person")!,
    country: text("country").default("XXA")!,
    disambiguation: text("disambiguation")!,
  },
  (t) => ({ nameIndex: index("name_index").on(t.name) })
);

// Releases table
export const releases = sqliteTable(
  "releases",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    artist_id: text("artist_id")
      .notNull()
      .references(() => artists.id),
    status: text("status").default("official"),
    release_date: text("release_date"),
    country: text("country"),
    disambiguation: text("disambiguation"),
    packaging: text("packaging", {
      enum: packagingEnum.options,
    }).default("CD"),
  },
  (t) => ({
    titleIndex: index("title_index").on(t.title),
    artistIdIndex: index("artist_id_index").on(t.artist_id),
  })
);

// Recordings table
export const recordings = sqliteTable(
  "recordings",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    length: integer("length", { mode: "number" }), // mode: "number" 추가
    disambiguation: text("disambiguation"),
    artist_id: text("artist_id").references(() => artists.id),
  },
  (t) => ({
    titleIndex: index("title_index").on(t.title),
    artistIdIndex: index("artist_id_index").on(t.artist_id),
  })
);

// Release-Recording relationship table
export const releaseRecordings = sqliteTable(
  "release_recordings",
  {
    releaseId: text("release_id").references(() => releases.id),
    recordingId: text("recording_id").references(() => recordings.id),
    trackPosition: integer("track_position"),
    discNumber: integer("disc_number").default(1),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.releaseId, t.recordingId] }),
  })
);

// Artist Credit Names table
export const artistCredits = sqliteTable(
  "artist_credits",
  {
    recordingId: text("recording_id").references(() => recordings.id),
    artist_id: text("artist_id").references(() => artists.id),
    joinPhrase: text("join_phrase"),
    name: text("name"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.recordingId, t.artist_id] }),
  })
);

// Tags table
export const tags = sqliteTable(
  "tags",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").unique(),
  },
  (t) => ({ nameIndex: index("name_index").on(t.name) })
);

// Artist Tags relationship table
export const artistTags = sqliteTable(
  "artist_tags",
  {
    artist_id: text("artist_id").references(() => artists.id),
    tagId: integer("tag_id").references(() => tags.id),
    count: integer("count").default(1),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.artist_id, t.tagId] }),
  })
);

// Release Tags relationship table
export const releaseTags = sqliteTable(
  "release_tags",
  {
    releaseId: text("release_id").references(() => releases.id),
    tagId: integer("tag_id").references(() => tags.id),
    count: integer("count").default(1),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.releaseId, t.tagId] }),
  })
);

// Recording Tags relationship table
export const recordingTags = sqliteTable(
  "recording_tags",
  {
    recordingId: text("recording_id").references(() => recordings.id),
    tagId: integer("tag_id").references(() => tags.id),
    count: integer("count").default(1),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.recordingId, t.tagId] }),
  })
);

// 2025-01-21 10:34:56
export const testTable = sqliteTable("test_table", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
