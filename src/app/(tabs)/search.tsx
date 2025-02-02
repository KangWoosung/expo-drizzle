/*
2025-01-03 02:54:56

A. insert into artists 처리 transaction:
  1. Insert into artists table
  2. if(artist.tags) { 
  2-1. Insert into tags table 
  2-2. Insert into artist_tags table
  }

2025-01-29 21:34:54
drizzle 버전으로 수정하였다.

*/

import { FlatList, Keyboard, Text, View } from "react-native";
import ApiArtistCard from "../_components/apiresults/ApiArtistCard";
import SearchForm from "../_components/apiform/SearchForm";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { useSQLiteContext } from "expo-sqlite";
import { toast } from "@/utils/toast";
import { MMKV } from "react-native-mmkv";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { count } from "drizzle-orm";
import { artists, tags as tagsTable, artistTags } from "@/db/drizzle/schema";
import {
  ApiArtistSchemaType,
  SelectArtistSchemaType,
} from "@/zod-schemas/artists";
import { SelectTagsSchemaType } from "@/zod-schemas/tags";
import { eq } from "drizzle-orm";

export default function SearchPage() {
  const [searchStr, setSearchStr] = useState("");
  const debouncedSearchStr = useDebounce(searchStr, 500);
  const searchInputRef = useRef(null);
  const db = useSQLiteContext();
  const drizzleDB = drizzle(db);
  const storage = new MMKV();

  useEffect(() => {
    // searchInputRef.current?.focus()

    return () => {
      Keyboard.dismiss();
    };
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", debouncedSearchStr],
    queryFn: async () => {
      if (!debouncedSearchStr.trim()) return { artists: [] };

      const response = await fetch(
        `https://musicbrainz.org/ws/2/artist?query=${encodeURIComponent(
          debouncedSearchStr
        )}&fmt=json`,
        {
          // MusicBrainz 에서 요구하는 User-Agent 헤더
          headers: {
            "User-Agent": "Hoerzu/1.0.0 ( http://hoerzu.example.com )",
            From: "Hoerzu/1.0.0 ( me@hoerzu.com )",
          },
        }
      );
      return response.json();
    },
    // 2글자 이상일 때만 queryFn enabled
    enabled: debouncedSearchStr.trim().length >= 2,
  });

  const handleSearch = (text: string) => {
    setSearchStr(text);
  };

  const updateArtistsCnt = async () => {
    const result = await drizzleDB.select({ count: count() }).from(artists);
    // console.log("New artistsCnt:", result);
    storage.set("artistsCnt", result[0].count);
    const newVal = storage.getNumber("artistsCnt");
    // console.log("New artistsCnt from MMKV:", newVal);
  };

  // 이 펑션은, ApiArtistCard 에서 인보크되고, ApiArtistSchemaType 을 받는다.
  async function handleSave(artist: ApiArtistSchemaType) {
    try {
      // await db.withTransactionAsync(async () => {
      await drizzleDB.transaction(async (tx) => {
        console.log("trying to save artist:", artist.name);
        // await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where()
        const result = await tx.insert(artists).values({
          id: artist.id,
          name: artist.name,
          sortName: artist.sortName,
          type: artist.type,
          country: artist.country,
          disambiguation: artist.disambiguation,
        });
        console.log("artist:", artist);

        // 2. 태그 저장
        // 이미 존재하는 태그에 대해 tags.id 를 준비해줘야만 한다.
        if (artist.tags) {
          for (const tag of artist.tags) {
            // 1. 먼저 태그.id 를 찾는다.
            const existingTag = await tx
              .select()
              .from(tagsTable)
              .where(eq(tagsTable.name, tag.name))
              .limit(1);

            // 태그가 존재하면 existingTag[0].id 를 사용하고, 없으면 새로 추가하고, returning 으로 받아온다.
            const tagId =
              existingTag.length > 0
                ? existingTag[0].id
                : (
                    await tx
                      .insert(tagsTable)
                      .values({ name: tag.name })
                      .returning({ id: tagsTable.id })
                  )[0].id;

            // 2. artist_tags 매핑 저장
            await tx.insert(artistTags).values({
              artist_id: artist.id,
              tagId: tagId,
              count: tag.count || 1,
            });
          }
        }
        // 4. Update Artists.count
        await updateArtistsCnt();

        // 5. 토스트 메시지
        toast.show("Artist saved: " + artist.name);
      });
    } catch (error: unknown) {
      console.error("Error saving artist:", error);
      toast.show(
        "Artist save failed: " +
          (error instanceof Error ? error.message : String(error))
      );
      throw error;
    } finally {
      console.log("Artist saved:", artist.name);
    }
  }

  return (
    <View className="flex-1">
      {/* <Header title="헬로월드 뮤직" subtitle="" /> */}

      <SearchForm ref={searchInputRef} onSearch={handleSearch} />

      {isLoading && <Text className="p-4">검색중...</Text>}
      {error && <Text className="p-4">에러가 발생했습니다</Text>}

      <FlatList
        data={data?.artists || []}
        renderItem={({ item }) => (
          <ApiArtistCard artist={item} handleSave={handleSave} />
        )}
      />
    </View>
  );
}
