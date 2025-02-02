/*
2025-01-29 20:54:54

drizzle 포팅을 완료함. 

  const result = (await drizzleDB
    .select()
    .from(releases)
    .where(eq(releases.artist_id, artistId))) as InsertAlbumSchemaType[];

* 타입 강제할당이 좀 찜찜하지만, insert 와 select 의 미세한 차이를 다루려면 어쩔 수 없었다. 
* 어차피 대부분 컬럼이 옵셔널이기 때문에, 문제는 없을 것이다. 

*/

import { useQuery } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { InsertAlbumSchemaType } from "@/zod-schemas/albums";
import { releases } from "@/db/drizzle/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { count, eq } from "drizzle-orm";

export const useArtistAlbumsDb = (
  artistId: string,
  showDbTrigger: boolean,
  setAlbumsData: (data: InsertAlbumSchemaType[] | null) => void
) => {
  const db = useSQLiteContext();
  const drizzleDB = drizzle(db, { schema: { releases } });

  // DB 데이터 조회 쿼리
  const albumsQuery = useQuery({
    queryKey: ["getAlbums", artistId],
    queryFn: async () => {
      try {
        const result = (await drizzleDB
          .select()
          .from(releases)
          .where(eq(releases.artist_id, artistId))) as InsertAlbumSchemaType[];
        setAlbumsData(result as InsertAlbumSchemaType[]);
        return result;
      } catch (error) {
        console.error("Error getting albums:", error);
        return [];
      }
    },
    enabled: showDbTrigger,
  });

  // DB 카운트 쿼리
  const albumsCountQuery = useQuery({
    queryKey: ["getAlbumsCount", artistId],
    queryFn: async () => {
      try {
        const result = await drizzleDB
          .select({ count: count() })
          .from(releases)
          .where(eq(releases.artist_id, artistId));
        return result as { count: number }[];
      } catch (error) {
        console.error("Error getting albums count:", error);
        return { total: 0 };
      }
    },
  });

  return {
    albums: albumsQuery.data,
    isLoading: albumsQuery.isLoading,
    error: albumsQuery.error,
    count: Array.isArray(albumsCountQuery.data)
      ? albumsCountQuery.data[0]?.count ?? 0
      : 0,
    isCountLoading: albumsCountQuery.isLoading,
    countError: albumsCountQuery.error,
  };
};
