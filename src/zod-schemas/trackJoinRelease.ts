import { z } from "zod";
import { selectTrackSchema, selectReleaseTrackSchema } from "./tracks";
import { selectAlbumSchema } from "./albums";

// 조인 결과를 위한 스키마
export const trackJoinReleaseSchema = z.array(
  z.object({
    // recordings 테이블 필드
    ...selectTrackSchema.shape,

    // release_recordings 테이블 필드
    ...selectReleaseTrackSchema.shape,

    // releases 테이블 필드 (prefix 추가)
    release_id: selectAlbumSchema.shape.id,
    release_title: selectAlbumSchema.shape.title,
    release_date: selectAlbumSchema.shape.release_date,
    release_status: selectAlbumSchema.shape.status,
    release_country: selectAlbumSchema.shape.country,
  })
);

// z.infer<typeof trackWithReleaseSchema>[number]
// 이 코드는 배열의 단일 요소의 타입을 얻습니다.
export type TrackJoinReleaseType = z.infer<
  typeof trackJoinReleaseSchema
>[number];

// 조인 쿼리 결과 검증을 위한 유틸리티 함수
export function validateTrackWithRelease(
  data: unknown
): TrackJoinReleaseType[] {
  return trackJoinReleaseSchema.parse(data);
}
