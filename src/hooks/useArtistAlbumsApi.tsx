import { useQuery } from "@tanstack/react-query";
import { AlbumType, ReleasesType } from "@/types";

export const useArtistAlbumsApi = (
  artistId: string,
  showApiTrigger: boolean,
  setAlbumsData: (data: AlbumType[] | null) => void
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

      const result: ReleasesType = await response.json();
      const sortedData: ReleasesType = { ...result };
      sortedData.releases = result.releases.sort((a, b) => {
        return a.date > b.date ? 1 : -1;
      });

      setAlbumsData(sortedData.releases);
      return sortedData;
    },
    enabled: showApiTrigger,
  });
};
