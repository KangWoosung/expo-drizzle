// /src/zod-schemas/artists.ts
// drizzle db 스키마로부터 zod 스키마를 직접 추출합니다.

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { artists } from "../db/drizzle/schema";
import { z } from "zod";
import { apiTagSchema } from "./tags";

// Optional: Enhanced validation
export const artistTypeEnumArray = [
  "person",
  "group",
  "orchestra",
  "choir",
  "character",
  "other",
] as const;
export const artistTypeEnum = z.enum(artistTypeEnumArray);

// Zod schemas for different operations
export const selectArtistSchema = createSelectSchema(artists);

export const baseInsertArtistSchema = createInsertSchema(artists);

// 필수 필드와 옵셔널 필드를 분리하여 스키마 구성
export const insertArtistSchema = baseInsertArtistSchema
  .required({
    id: true,
    name: true,
  })
  .extend({
    name: z.string().min(1, "Artist Name is required"),
    sortName: z.string().optional(),
    type: artistTypeEnum.default("person"),
    country: z.string().default("XXA"),
    disambiguation: z.string().nullable().optional(),
  });

// Types
export type SelectArtistSchemaType = z.infer<typeof selectArtistSchema>;
export type InsertArtistSchemaType = z.infer<typeof insertArtistSchema>;

// artists + tags Join schema
export type ArtistWithTagsType = SelectArtistSchemaType & {
  tags: [];
};

// Enhanced schema for insert
export const enhancedArtistSchema = insertArtistSchema.extend({
  type: artistTypeEnum.nullable().optional(),
  beginDate: z
    .string()
    .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/)
    .nullable()
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/)
    .nullable()
    .optional(),
});

export type EnhancedArtistSchemaType = z.infer<typeof enhancedArtistSchema>;

// API 응답 스키마
/*
export type ArtistType = {
  id: string;
  name: string;
  sort_name?: string;
  country?: string | null;
  type?: string | null;
  disambiguation?: string | null;
  begin_date?: string | null;
  end_date?: string | null;
  score?: number; // 새로운 score 필드
  albumsCnt?: number; // 새로운 albumsCnt 필드
};
*/
export const apiArtistSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  sortName: z.string().optional(),
  type: artistTypeEnum.default("person").optional(),
  country: z.string().default("XXA").optional(),
  disambiguation: z.string().nullable().optional(),
  beginDate: z
    .string()
    .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/)
    .nullable()
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/)
    .nullable()
    .optional(),
  score: z.number().optional(),
  albumsCnt: z.number().optional(),
  tags: z.array(apiTagSchema).optional(),
});

export type ApiArtistSchemaType = z.infer<typeof apiArtistSchema>;

// 최종 타입의 모든 필드 타입들이 optional 로 표시되는 경우,
// tsconfig.json 의 CompilerOptions 에서, "strict": true, 를 설정해주셔야 합니다.
// 프로젝트에서 strict: true 를 설정하기 어려운 상황이라면,
// "strictNullChecks": true 로도 이 문제를 해결할 수 있습니다.
