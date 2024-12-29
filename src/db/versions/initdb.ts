/*
2024-12-28 15:38:40
db: HOERZU
*/

import * as SQLite from 'expo-sqlite';

const initialize = async (db: SQLite.SQLiteDatabase) => {
    

  await db.execAsync(
    `PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 3000;
    PRAGMA synchronous = NORMAL;
    PRAGMA foreign_keys = ON;
    PRAGMA encoding = 'UTF-8';

    -- Artists table
    CREATE TABLE artists (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sort_name TEXT,
        type TEXT,
        country TEXT,
        disambiguation TEXT,
        begin_date TEXT,
        end_date TEXT
    );

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

    -- Recordings table (tracks)
    CREATE TABLE recordings (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        length INTEGER,  -- duration in milliseconds
        disambiguation TEXT,
        artist_id TEXT,
        FOREIGN KEY(artist_id) REFERENCES artists(id)
    );

    -- Release-Recording relationship table
    CREATE TABLE release_recordings (
        release_id TEXT,
        recording_id TEXT,
        track_position INTEGER,
        disc_number INTEGER DEFAULT 1,
        PRIMARY KEY (release_id, recording_id),
        FOREIGN KEY(release_id) REFERENCES releases(id),
        FOREIGN KEY(recording_id) REFERENCES recordings(id)
    );

    -- Artist Credit Names table (for featuring artists)
    CREATE TABLE artist_credits (
        recording_id TEXT,
        artist_id TEXT,
        join_phrase TEXT,
        name TEXT,
        PRIMARY KEY (recording_id, artist_id),
        FOREIGN KEY(recording_id) REFERENCES recordings(id),
        FOREIGN KEY(artist_id) REFERENCES artists(id)
    );

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

    -- Create indexes for better query performance
    CREATE INDEX idx_artists_name ON artists(name);
    CREATE INDEX idx_releases_title ON releases(title);
    CREATE INDEX idx_recordings_title ON recordings(title);
    CREATE INDEX idx_release_recordings_release ON release_recordings(release_id);
    CREATE INDEX idx_release_recordings_recording ON release_recordings(recording_id);
        
    `
  );

  
}

export default initialize