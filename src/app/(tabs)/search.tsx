/*
2025-01-03 02:54:56

A. insert into artists 처리 transaction:
  1. Insert into artists table
  2. if(artist.tags) { 
  2-1. Insert into tags table 
  2-2. Insert into artist_tags table
  }

*/

import { FlatList, Keyboard, Text, View } from "react-native";

import { Header } from "@/components/header";

import ApiArtistCard from "../_components/apiresults/ApiArtistCard";
import SearchForm from "../_components/apiform/SearchForm";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { useArtistsRepository } from "../../db";
import { useTagsRepository } from "../../db";
import { useSQLiteContext } from "expo-sqlite";
import { toast } from "@/utils/toast";
import { TagType } from "@/types/tagType";

export default function SearchPage() {
  const [searchStr, setSearchStr] = useState("");
  const debouncedSearchStr = useDebounce(searchStr, 500);
  const searchInputRef = useRef(null);
  const db = useSQLiteContext();
  const artistsRepo = useArtistsRepository(db);
  const tagsRepo = useTagsRepository(db);

  useEffect(() => {
    // searchInputRef.current?.focus()

    return () => {
      Keyboard.dismiss();
      db.closeAsync(); // 컴포넌트 언마운트 시 명시적으로 닫기
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

  async function handleSave(artist: any) {
    try {
      await db.withTransactionAsync(async () => {
        console.log("trying to save artist:", artist.name);
        // 1. 아티스트 저장
        await artistsRepo.insert({
          id: artist.id,
          name: artist.name,
          type: artist.type,
          country: artist.country,
          disambiguation: artist.disambiguation,
          begin_date: artist["life-span"]?.begin,
          end_date: artist["life-span"]?.end,
        });
        console.log("artist:", artist);

        // 2. 태그 저장
        if (artist.tags) {
          for (const tag of artist.tags as TagType[]) {
            // 존재하는 중복 태그에서도 lastInsertRowId 를 반환하도록 레포지토리를 수정하였다.
            const tagResult = await tagsRepo.insert(tag.name);
            // 3. 아티스트-태그 매핑 저장
            await tagsRepo.insertArtistTag(
              artist.id,
              tagResult.lastInsertRowId,
              tag.count || 1
            );
          }
        }
        // 4. 토스트 메시지
        toast.show("Artist saved: " + artist.name);
      });
    } catch (error) {
      console.error("Error saving artist:", error);
      throw error;
    } finally {
      console.log("Artist saved:", artist.name);
    }
  }

  return (
    <View className="flex-1">
      <Header title="헬로월드 뮤직" subtitle="My music database" />

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
