/*

*/

import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";

export const useArtistsRepository = (db: SQLiteDatabase) => {
  async function totalCnt() {
    try {
      const row = await db.getFirstAsync(`
                SELECT COUNT(*) AS total FROM artists;
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

  function selectRange(start: number, end: number) {
    //  아직 준비중입니다.
  }

  async function selectById(id: string) {
    try {
      const result = await db.getFirstAsync(
        `
        SELECT * FROM artists
        WHERE id = ?
            `,
        [id]
      );
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async function insert(artist: any) {
    try {
      const statement = await db.prepareAsync(`
        INSERT INTO artists (id, name, country, type, disambiguation, begin_date, end_date)
        VALUES ($id, $name, $country, $type, $disambiguation, $begin_date, $end_date); 
        `);

      await statement.executeAsync({
        $id: artist.id,
        $name: artist.name,
        $country: artist.country,
        $type: artist.type,
        $disambiguation: artist.disambiguation,
        $begin_date: artist["life-span"]?.begin,
        $end_date: artist["life-span"]?.end,
      });

      await statement.finalizeAsync();
      console.log("artist insert query completed");
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async function deleteById(id: string) {
    try {
      await db.runAsync(
        `
        DELETE FROM artists
        WHERE id = ?
            `,
        [id]
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  return { totalCnt, selectRange, selectById, insert, deleteById };
};
