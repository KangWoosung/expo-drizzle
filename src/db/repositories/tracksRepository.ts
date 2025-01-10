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

import { TrackObjType, TrackType } from "@/types";
import { TagType } from "@/types/tagType";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";

type CountResult = {
  total: number;
};

export const useTracksRepository = (db: SQLiteDatabase) => {
  async function totalCnt() {
    try {
      const row = await db.getFirstAsync(`
                SELECT COUNT(*) AS total FROM recordings;
            `);
      console.log("total cnt: ", row);
      if (row && typeof row === "object" && "total" in row) {
        return row.total as number;
      }
      return 0;
    } catch (e) {
      console.error(e);
      return 0;
    }
  }

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

  async function selectTracksByAlbumId(
    albumId: string
  ): Promise<TrackObjType[]> {
    const result = await db.getAllAsync(
      `
            SELECT r.id, r.title, r.length, r.disambiguation, r.artist_id, rr.track_position
            FROM release_recordings rr
            JOIN recordings r ON r.id = rr.recording_id
            WHERE rr.release_id = ?
            ORDER BY rr.track_position
        `,
      [albumId]
    );
    return (result as TrackObjType[]) || [];
  }

  async function selectTrackById(id: string): Promise<TrackType> {
    const result = await db.getFirstAsync(
      `
            SELECT * FROM recordings
            WHERE id = ?
        `,
      [id]
    );
    return (result as TrackType) || null;
  }

  // Track insert
  async function insertTrack(track: TrackObjType, artistId: string) {
    const statement = await db.prepareAsync(`
            INSERT OR IGNORE INTO recordings (id, title, length, disambiguation, artist_id)
            VALUES ($id, $title, $length, $disambiguation, $artistId);
        `);

    const result = statement.executeAsync({
      $id: track.id,
      $title: track.title,
      $length: track.length || 0,
      $disambiguation: track.recording?.disambiguation || "",
      $artistId: artistId,
    });
    statement.finalizeAsync();
    return result;
  }

  // release_recordings table insert
  // release_id TEXT,
  // recording_id TEXT,
  // track_position INTEGER,
  // disc_number INTEGER DEFAULT 1,
  async function insertReleaseRecordings(
    albumId: string,
    trackId: string,
    position: number
  ) {
    const statement = await db.prepareAsync(`
            INSERT OR IGNORE INTO release_recordings (release_id, recording_id, track_position)
            VALUES (?, ?, ?);
        `);
    const result = statement.executeAsync([albumId, trackId, position]);
    statement.finalizeAsync();
    return result;
  }

  // Tags insert
  async function insertTags(tags: TagType[]) {
    if (tags.length === 0) return;
    const statement = await db.prepareAsync(`
                INSERT OR IGNORE INTO tags (name, count)
                VALUES (?, ?);
            `);
    for (const tag of tags) {
      await statement.executeAsync([tag.name, tag.count || 1]);
    }
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

  /*
  트랙은 삭제하지 않고, 연관 정보만 삭제하라고 한다. 클로드가.
  들어보니 설득당했다.
  */
  async function deleteTracksByAlbumId(albumId: string) {
    const result = await db.runAsync(
      `
    DELETE FROM release_recordings
    WHERE release_id = ?;
    `,
      [albumId]
    );
    return result;
  }

  return {
    totalCnt,
    selectCountByAlbumId,
    selectTracksByAlbumId,
    selectTrackById,
    insertTrack,
    insertReleaseRecordings,
    insertTags,
    deleteTrackById,
    deleteTracksByAlbumId,
  };
};
