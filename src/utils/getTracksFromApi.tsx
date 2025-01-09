/*

https://musicbrainz.org/ws/2/release/[album_id]?inc=recordings&fmt=json
https://musicbrainz.org/ws/2/release/[album_id]?inc=recordings&fmt=json
https://musicbrainz.org/ws/2/recording/[albumId]?inc=artist-credits+isrcs+releases
*/

export const getTracksFromApi = async (albumId: string) => {
  const response = await fetch(
    `https://musicbrainz.org/ws/2/release/${albumId}?inc=recordings&fmt=json`,
    {
      headers: {
        "User-Agent": "Hoerzu/1.0.0 ( http://hoerzu.example.com )",
        From: "Hoerzu/1.0.0 ( me@hoerzu.com )",
      },
    }
  );
  console.log(
    `https://musicbrainz.org/ws/2/release/${albumId}?inc=recordings&fmt=json`
  );
  const result = await response.json();
  return result;
};
