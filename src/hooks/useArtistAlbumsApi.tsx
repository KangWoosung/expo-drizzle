import {
  ApiReleasesSchemaType,
  InsertAlbumSchemaType,
} from "@/zod-schemas/albums";
import { useQuery } from "@tanstack/react-query";

export const useArtistAlbumsApi = (
  artistId: string,
  showApiTrigger: boolean,
  setAlbumsData: (data: InsertAlbumSchemaType[] | null) => void
) => {
  return useQuery({
    queryKey: ["searchAlbum", artistId],
    queryFn: async () => {
      const response = await fetch(
        `https://musicbrainz.org/ws/2/release?artist=${artistId}&fmt=json`,
        {
          headers: {
            "User-Agent": "Hoerzu/1.0.0 ( http://hoerzu.example.com )",
            From: "Hoerzu/1.0.0 ( me@hoerzu.com )",
          },
        }
      );

      const result: ApiReleasesSchemaType = await response.json();
      const sortedData: ApiReleasesSchemaType = { ...result };
      sortedData.releases = result.releases.sort((a, b) => {
        return a.date > b.date ? 1 : -1;
      });

      setAlbumsData(sortedData.releases as InsertAlbumSchemaType[]);
      return sortedData;
    },
    enabled: showApiTrigger,
  });
};
