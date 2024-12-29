/*
2024-12-28 17:54:01

SQLite DB 버전 관리 Init Function
업그레이드가 필요한 경우에 해당 버전 function 을 실행합니다.
업그레이드 펑션은 migrateFunctions.ts 에서 관리됩니다.

DB 스키마 업그레이드가 필요할 때 해야할 일들 :
1. /db/versions 폴더에 새로운 버전의 스키마 업데이트 펑션 파일을 생성합니다.
2. /db/migrateFunctions.ts - const migrations 배열에 추가한 버전과 펑션을 추가합니다.
--끗--

SQLite DB Version Management Init Function
Executes version functions when upgrades are needed.
Upgrade functions are managed in migrateFunctions.ts

Steps to take when DB schema upgrade is needed:
1. Create a new schema update function file in /db/versions folder
2. Add the new version function to /db/migrateFunctions.ts
--end--

*/

import { SQLiteDatabase } from "expo-sqlite"
import { migrations, logMigration, LATEST_DB_VERSION } from "./migrateFunctions";
import initialize from './versions/initdb';

const upgradeDbIfNeeded = async (db: SQLiteDatabase) => {

    try {
        // 버전 오브젝트의 유효성을 검증
        validateVersions();

      let { user_version: currentDbVersion } = (await db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
      ))!;
      console.log('currentDbVersion: ', currentDbVersion);
      console.log('LATEST_DB_VERSION: ', LATEST_DB_VERSION);

      // 초기 Init 이 누락되었다.
    if (currentDbVersion === 0) {
        console.log('Initializing database');
        initialize(db);
    }
  
      if (currentDbVersion >= LATEST_DB_VERSION) {
        return;
      }
  
      await db.withTransactionAsync(async () => {
        for (const migration of migrations) {
          if (migration.version > currentDbVersion) {
            console.log(`Migrating to version ${migration.version}`);
            try {
                await migration.migrate(db);
                await logMigration(db, migration.version, true);
                await db.execAsync(`PRAGMA user_version = ${migration.version}`);
                currentDbVersion = migration.version;
            } catch (error) {
                await logMigration(db, migration.version, false);
                throw error;
              }
          }
        }
      });
  
    } catch (error) {
      console.error('Database migration failed:', error);
      throw new Error(`Failed to upgrade database: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  export default upgradeDbIfNeeded;


  // 버전의 유효성을 검증합니다.
  const validateVersions = () => {
    if (migrations.length === 0) return;
    
    // 버전 순서 확인
    const versions = migrations.map(m => m.version);
    const sorted = [...versions].sort((a, b) => a - b);
    if (!versions.every((v, i) => v === sorted[i])) {
      throw new Error('Migrations must be ordered by version');
    }
  
    // 버전 연속성 확인
    if (versions[0] !== 1) {
      throw new Error('Migrations must start from version 1');
    }
    for (let i = 1; i < versions.length; i++) {
      if (versions[i] !== versions[i-1] + 1) {
        throw new Error('Migration versions must be consecutive');
      }
    }
  }