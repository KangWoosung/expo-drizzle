import { useCallback, useState, useRef } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { parseDictionaryEntry } from '@/helpers/parseDictionaryEntry';

export function useSearch() {
  const dbQuery = useRef<AsyncIterableIterator<any>>();
  const shouldEmptyResultsList = useRef<boolean>(false);
  const [result, setResult] = useState<any[]>([]);

  const db = useSQLiteContext();

  const search = useCallback((term: string) => {
    dbQuery.current = db.getEachAsync(
      `
      SELECT *
      FROM words
      WHERE words.word LIKE ?
      ORDER BY words.word
      `,
      [`${term}%`]
    );
    shouldEmptyResultsList.current = true;
  }, [db]);

  const loadNext = useCallback(async (count: number) => {
    if (!dbQuery.current) return;

    const results: any[] = [];
    let i = 0;
    while (i < count) {
      const row = await dbQuery.current.next();
      if (row.done) break;
      const parsedEntry = parseDictionaryEntry(row.value);
      results.push(parsedEntry);
      i++;
    }

    setResult((prev) => {
      if (shouldEmptyResultsList.current) {
        shouldEmptyResultsList.current = false;
        return results;
      } else {
        return [...prev, ...results];
      }
    });
  }, []);

  return {
    result,
    search,
    loadNext
  }
}