import { useQuery } from "@tanstack/react-query";
import { AlbumType } from "@/types";
import { useAlbumsRepository } from "@/db/repositories/albumsRepository";
import { useSQLiteContext } from "expo-sqlite";

export const useArtistAlbumsDb = (
  artistId: string,
  showDbTrigger: boolean,
  setAlbumsData: (data: AlbumType[] | null) => void
) => {
  const db = useSQLiteContext();
  const albumsRepository = useAlbumsRepository(db);

  // DB 데이터 조회 쿼리
  const albumsQuery = useQuery({
    queryKey: ["getAlbums", artistId],
    queryFn: async () => {
      try {
        const result = await albumsRepository.selectByArtistId(artistId);
        setAlbumsData(result);
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
        const result = await albumsRepository.selectCountByArtistId(artistId);
        return result;
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
    count: albumsCountQuery.data?.total ?? 0,
    isCountLoading: albumsCountQuery.isLoading,
    countError: albumsCountQuery.error,
  };
};
