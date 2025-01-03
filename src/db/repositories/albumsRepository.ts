/*
2025-01-03 05:24:10

-- Releases table (albums)
CREATE TABLE releases (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT,
    release_date TEXT,
    country TEXT,
    disambiguation TEXT,
    packaging TEXT,
    artist_id TEXT,
    FOREIGN KEY(artist_id) REFERENCES artists(id)
);
*/
import { AlbumType } from "@/types";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
// 타입 정의 추가
type CountResult = {
  total: number;
};

export const useAlbumsRepository = (db: SQLiteDatabase) => {
  async function selectCountByArtistId(artistId: string): Promise<CountResult> {
    const result = await db.getFirstAsync(
      `
        SELECT COUNT(*) AS total FROM releases
        WHERE artist_id = ?
     `,
      [artistId]
    );
    return (result as CountResult) || { total: 0 };
  }

  async function selectByArtistId(artistId: string) {
    const result = db.getAllAsync(
      `
        SELECT * FROM releases
        WHERE artist_id = ?
     `,
      [artistId]
    );
    return result;
  }

  async function insert(album: AlbumType) {
    const statement = await db.prepareAsync(`
        INSERT OR IGNORE INTO releases (id, artist_id, title, release_date, country, disambiguation, packaging, status)
        VALUES ($id, $artist_id, $title, $release_date, $country, $disambiguation, $packaging, $status); 
    `);
    try {
      if (!album.artistId) throw new Error("Artist ID is required");
      const result = await statement.executeAsync({
        $id: album.id,
        $artist_id: album.artistId,
        $title: album.title,
        $release_date: album.date,
        $country: album.country ?? null,
        $disambiguation: album.disambiguation ?? null,
        $packaging: album.packaging ?? null,
        $status: album.status ?? null,
      });
      return result;
    } catch (error) {
      console.error("Error inserting album:", error);
      throw error;
    } finally {
      await statement.finalizeAsync();
      console.log("Album successfully inserted into DB");
    }
  }

  return {
    selectCountByArtistId,
    selectByArtistId,
    insert,
  };
};
