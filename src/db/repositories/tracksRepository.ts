/*
2025-01-05 21:08:15

-- Recordings table (tracks)
CREATE TABLE recordings (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    length INTEGER,  -- duration in milliseconds
    disambiguation TEXT,
    artist_id TEXT,
    FOREIGN KEY(artist_id) REFERENCES artists(id)
);
-- Release-Recording relationship table (album-table)
CREATE TABLE release_recordings (
    release_id TEXT,
    recording_id TEXT,
    track_position INTEGER,
    disc_number INTEGER DEFAULT 1,
    PRIMARY KEY (release_id, recording_id),
    FOREIGN KEY(release_id) REFERENCES releases(id),
    FOREIGN KEY(recording_id) REFERENCES recordings(id)
);
-- Recording Tags relationship table
CREATE TABLE recording_tags (
    recording_id TEXT,
    tag_id INTEGER,
    count INTEGER DEFAULT 1,
    PRIMARY KEY (recording_id, tag_id),
    FOREIGN KEY(recording_id) REFERENCES recordings(id),
    FOREIGN KEY(tag_id) REFERENCES tags(id)
);

*/

import { TrackType } from "@/types";
import { TagType } from "@/types/tagType";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";

type CountResult = {
  total: number;
};

export const useAlbumsRepository = (db: SQLiteDatabase) => {
  async function selectCountByAlbumId(albumId: string): Promise<CountResult> {
    const row = db.getFirstSync(
      `
            SELECT COUNT(*) AS total 
            FROM release_recordings rr
            JOIN recordings r ON r.id = rr.recording_id
            WHERE rr.release_id = ?
        `,
      [albumId]
    );
    if (row && typeof row === "object" && "total" in row) {
      return { total: row.total as number };
    }
    return { total: 0 };
  }

  // Track insert
  async function insertTrack(track: TrackType) {
    const statement = await db.prepareAsync(`
            INSERT OR IGNORE INTO recordings (id, title, length, position, disambiguation, artist_id)
            VALUES ($id, $title, $length, $position, $disambiguation, $artistId);
        `);

    const result = statement.executeAsync({
      $id: track.id,
      $name: track.title,
      $length: track.duration,
      $position: track.position,
      $disambiguation: track.disambiguation,
      $artistId: track.artistId,
    });
    statement.finalizeAsync();
    return result;
  }

  // Tags insert
  async function insertTags(tags: TagType[]) {
    const statement = await db.prepareAsync(`
                INSERT OR IGNORE INTO tags (name, count)
                VALUES (?, ?);
            `);
    tags.forEach((tag) => {
      statement.executeAsync([tag.name, tag.count || 1]);
    });
    statement.finalizeAsync();
    return;
  }

  async function deleteTrackById(id: string) {
    const result = db.runAsync(
      `
            DELETE FROM tracks
            WHERE id = ?;
        `,
      [id]
    );
    return result;
  }

  return { selectCountByAlbumId, insertTrack, insertTags, deleteTrackById };
};
