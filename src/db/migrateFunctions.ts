/*
2024-12-28 21:26:02

DB 업그레이드 펑션들을 지정합니다.
업그레이드 펑션 이름을 배열에 추가하고 버전을 지정합니다.
지정된 펑션은, upgradeDbIfNeeded.ts 에서 순차적으로 실행됩니다.

DB 스키마 업그레이드가 필요할 때 해야할 일들 :
1. /db/versions 폴더에 새로운 버전의 스키마 업데이트 펑션 파일을 생성합니다.
2. /db/migrateFunctions.ts - const migrations 배열에 추가한 버전과 펑션을 추가합니다.
--끗--

Steps to take when DB schema upgrade is needed:
1. Create a new schema update function file in /db/versions folder
2. Add the new version function to /db/migrateFunctions.ts - const migrations array
--end--

*/

import { SQLiteDatabase } from "expo-sqlite";
import upgradeDBver01 from "./versions/version01";

type MigrationFn = (db: SQLiteDatabase) => Promise<void>;

type MigrationType = {
  version: number;
  migrate: MigrationFn;
}

//////////////////////////////////////////////////////////////////////
// Add your migration functions here
export const migrations: MigrationType[] = [
//   { version: 1, migrate: upgradeDBver01 },
  // { version: 2, migrate: version02 },
];
//////////////////////////////////////////////////////////////////////

// 최신 버전은 migrations 배열에서 자동으로 계산, export 된다.
// 이제, LATEST_DB_VERSION 이 사용되고, DECLARED_DB_VERSION 는 폐기됩니다.
export const LATEST_DB_VERSION = migrations.length > 0 
  ? Math.max(...migrations.map(m => m.version)) 
  : 0;


export type MigrationLog = {
    version: number;
    executed_at: string;
    success: boolean;
  }

// Logging Migration History into DB
export const logMigration = async (db: SQLiteDatabase, version: number, success: boolean) => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS migration_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version INTEGER,
        executed_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
        success BOOLEAN
        )
    `);
    
    // runAsync
    await db.runAsync(`
        INSERT INTO migration_logs (version, success)
        VALUES (?, ?)
    `, [version, success]);
  };