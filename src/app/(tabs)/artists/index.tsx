/*
2025-01-29 21:37:15

drizzle 버전으로 수정하였다.

*/

import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import DBArtistCard from "@/app/_components/dbresults/DBArtistCard";
import { toast } from "@/utils/toast";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { artists as artistsTable } from "@/db/drizzle/schema";
import {
  InsertArtistSchemaType,
  SelectArtistSchemaType,
} from "@/zod-schemas/artists";
import * as schema from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";

const ITEMS_PER_PAGE = 10;

const Artists = () => {
  const [artists, setArtists] = useState<SelectArtistSchemaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const db = useSQLiteContext();
  const drizzleDB = drizzle(db);

  // 아티스트 데이터 로드 함수
  const loadArtists = async (currentOffset: number) => {
    try {
      console.log("loadArtists:", currentOffset);

      // Drizzle ORM을 사용하여 데이터 조회 (LIMIT와 OFFSET 적용)
      const result = await drizzleDB
        .select()
        .from(artistsTable)
        .limit(ITEMS_PER_PAGE)
        .offset(currentOffset)
        .execute();

      // 더 로드할 데이터가 있는지 확인
      if (result.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      return result;
    } catch (error) {
      console.error("Artists 로딩 에러:", error);
      return [];
    }
  };

  // 아티스트 삭제 함수
  const deleteArtist = async (id: string) => {
    try {
      await drizzleDB.delete(schema.artists).where(eq(schema.artists.id, id));
      console.log("Artist deleted:", id);
      setArtists((prev) => prev.filter((artist) => artist.id !== id));
      toast.show("Artist deleted");
    } catch (error) {
      console.error("Artist 삭제 에러:", error);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    const initialLoad = async () => {
      try {
        const initialArtists = await loadArtists(0);
        setArtists(initialArtists);
      } finally {
        setIsLoading(false);
      }
    };

    initialLoad();
  }, []);

  // 추가 데이터 로드 (무한 스크롤)
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextOffset = offset + ITEMS_PER_PAGE;
      const moreArtists = await loadArtists(nextOffset);

      setArtists((prev) => [...prev, ...moreArtists]);
      setOffset(nextOffset);
      toast.show("More artists loaded");
    } finally {
      setIsLoadingMore(false);
    }
  }, [offset, isLoadingMore, hasMore]);

  // 로딩 중 표시
  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View className="py-4 justify-center items-center">
        <Text className="text-gray-600 dark:text-gray-400">
          더 불러오는 중...
        </Text>
      </View>
    );
  };

  // 아티스트 카드 렌더링
  const renderItem = ({ item }: { item: InsertArtistSchemaType }) => (
    <DBArtistCard artist={item} deleteArtist={deleteArtist} key={item.id} />
  );

  // 로딩 중 UI
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600 dark:text-gray-400">로딩 중...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={artists as InsertArtistSchemaType[]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore} // 무한 스크롤 이벤트
        onEndReachedThreshold={0.5} // 스크롤 위치 임계값 (0.5 = 50%)
        ListFooterComponent={renderFooter} // 로딩 중 표시
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-gray-600 dark:text-gray-400">
              등록된 아티스트가 없습니다.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Artists;
