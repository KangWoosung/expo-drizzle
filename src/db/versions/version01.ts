/*
2024-12-28 15:35:38
db: HOERZU


*/

import * as SQLite from 'expo-sqlite';

const upgradeDBver01 = async (db: SQLite.SQLiteDatabase) => {
	{/* ... add some shcemas ... */}
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ver_01 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field text
    )
`);
}

export default upgradeDBver01
