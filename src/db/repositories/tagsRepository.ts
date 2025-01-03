/*
2025-01-03 03:12:33

-- Tags table
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Artist Tags relationship table
CREATE TABLE artist_tags (
    artist_id TEXT,
    tag_id INTEGER,
    count INTEGER DEFAULT 1,
    PRIMARY KEY (artist_id, tag_id),
    FOREIGN KEY(artist_id) REFERENCES artists(id),
    FOREIGN KEY(tag_id) REFERENCES tags(id)
);

-- Release Tags relationship table
CREATE TABLE release_tags (
    release_id TEXT,
    tag_id INTEGER,
    count INTEGER DEFAULT 1,
    PRIMARY KEY (release_id, tag_id),
    FOREIGN KEY(release_id) REFERENCES releases(id),
    FOREIGN KEY(tag_id) REFERENCES tags(id)
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

[Artist/Album].Delete 처리시에는 Tags 를 굳이 delete 하지 않기로 결정한다.
tag 만 남아있는 경우, 단순 insert 쿼리는 문제를 발생시킨다. lastInsertRowId 를 반환할 수 없기 때문이다.
수작업으로, lastInsertRowId 를 반환해주도록 수정해주자.
-- 끗 --

// 3. 아티스트-태그 매핑 저장
await db.runAsync(
    "INSERT INTO artist_tags (artist_id, tag_id) VALUES (?, ?)",
    [artist.id, tagResult.lastInsertRowId]
);
*/

import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";

export const useTagsRepository = (db: SQLiteDatabase) => {
  function selectByTag(name: string) {
    const result = db.getAllAsync(
      `
            SELECT * FROM tags
            WHERE name = ?
        `,
      [name]
    );
    return result;
  }

  async function insert(name: string) {
    try {
      // 먼저 기존 태그 조회
      const existingTag = await db.getFirstAsync<{ id: number }>(
        `SELECT id FROM tags WHERE name = ?`,
        [name]
      );

      if (existingTag) {
        // 이미 존재하는 태그인 경우 해당 id 반환
        return { lastInsertRowId: existingTag.id };
      }

      // 새로운 태그 삽입
      const result = await db.runAsync(`INSERT INTO tags (name) VALUES (?);`, [
        name,
      ]);
      return result;
    } catch (error) {
      console.error("Error inserting tag:", error);
      throw error;
    }
  }

  async function deleteById(id: number) {
    await db.runAsync(
      `
            DELETE FROM tags
            WHERE id = ?
        `,
      [id]
    );
    return;
  }

  // insert artist_tag with IGNORE to handle duplicates
  const insertArtistTag = async (
    artistId: string,
    tagId: number,
    count: number
  ) => {
    try {
      await db.runAsync(
        `INSERT OR IGNORE INTO artist_tags (artist_id, tag_id, count)
         VALUES (?, ?, ?);`,
        [artistId, tagId, count]
      );
    } catch (error) {
      console.error("Error inserting artist_tag:", error);
      throw error;
    }
  };

  // release_tags table
  const insertReleaseTag = async (
    releaseId: string,
    tagId: number,
    count: number
  ) => {
    try {
      await db.runAsync(
        `INSERT OR IGNORE INTO release_tags (release_id, tag_id, count)
             VALUES (?, ?, ?);`,
        [releaseId, tagId, count]
      );
    } catch (error) {
      console.error("Error inserting release_tag:", error);
      throw error;
    }
  };

  return {
    selectByTag,
    insert,
    deleteById,
    insertArtistTag,
    insertReleaseTag,
  };
};
