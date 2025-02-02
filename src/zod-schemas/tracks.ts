/*
2025-01-31 16:43:48
기본 스키마가, tracks 에서는 단일테이블이 아닌 join 으로 설계되어 있다.
때문에, tracks 스키마는 다른 스키마와는 다르게 접근해야 한다.

이 모듈의 실질적인 목적 스키마와 타입은, trackJoinReleaseSchema 와 TrackJoinReleaseType 이다.
recordings, releases, release_recordings 이렇게 3개의 테이블이 조인된다.

2025-01-31 17:43:04
모듈이 조금 복잡해졌으므로, 앞으로 관리에 주의해야 한다.

*/

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { recordings, releaseRecordings, releases } from "../db/drizzle/schema";
import { z } from "zod";

// 기본 스키마 생성
export const selectTrackSchema = createSelectSchema(recordings);
export const selectReleaseTrackSchema = createSelectSchema(releaseRecordings);

export const baseInsertTrackSchema = createInsertSchema(recordings);
export const baseInsertReleaseTrackSchema =
  createInsertSchema(releaseRecordings);

// 트랙 정보 insert 스키마
export const insertTrackSchema = baseInsertTrackSchema
  .required({
    id: true,
    title: true,
  })
  .extend({
    title: z.string().min(1, "Track Title is required"),
    length: z.number().optional(),
    disambiguation: z.string().nullable().optional(),
    artist_id: z.string().optional(),
  });

// 릴리스-트랙 관계 insert 스키마
export const insertReleaseTrackSchema = baseInsertReleaseTrackSchema
  .required({
    releaseId: true,
    recordingId: true,
  })
  .extend({
    trackPosition: z.number().optional(),
    discNumber: z.number().default(1),
  });

// 통합 트랙  스키마 (recordings + release_recordings)
export const insertFullTrackSchema = insertTrackSchema.merge(
  insertReleaseTrackSchema
);

export type SelectTrackSchemaType = z.infer<typeof selectTrackSchema>;
export type SelectReleaseTrackSchemaType = z.infer<
  typeof selectReleaseTrackSchema
>;
export type InsertTrackSchemaType = z.infer<typeof insertTrackSchema>;
export type InsertReleaseTrackSchemaType = z.infer<
  typeof insertReleaseTrackSchema
>;
export type InsertFullTrackSchemaType = z.infer<typeof insertFullTrackSchema>;

// API 응답 스키마
export const apiTrackSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  length: z.number().optional(),
  position: z.number().optional(),
  discNumber: z.number().optional(),
  disambiguation: z.string().nullable().optional(),
  artist_id: z.string().optional(),
});

export type ApiTrackSchemaType = z.infer<typeof apiTrackSchema>;
