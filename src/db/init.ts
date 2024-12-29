/*
2024-12-29 01:55:13
굳이 이렇게 한 단계를 더 넣은 이유..
upgradeDbIfNeeded 를 충분히 테스트하고, initialize 를 upgradeDbIfNeeded 에 통합하기 위한 준비작업...




*/

import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import initialize from './versions/initdb';
import upgradeDbIfNeeded from './upgradeDbIfNeeded';

// export async function openDatabase() {
//   if (Platform.OS === "web") {
//     return {
//       transaction: () => {
//         return {
//           executeSql: () => {},
//         };
//       },
//     } as any;
//   }
//   return await SQLite.openDatabaseAsync("music.db");
// }

export const initDatabase = async (db: SQLite.SQLiteDatabase) => {

  return await upgradeDbIfNeeded(db);
  // return await initialize(db);
};