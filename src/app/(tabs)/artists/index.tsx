/*
2024-12-30 09:49:06

Infinite Scroll w. SQLite getEachAsync Example:
https://carrithers.me/building-an-infinitely-scrolling-search-component-with-expo-react-native-and-sqlite


    <View className="p-4 border-b border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {item.name}
      </Text>
      {item.country && (
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          {item.country}
        </Text>
      )}
      {item.type && (
        <Text className="text-sm text-gray-500 dark:text-gray-500">
          {item.type}
        </Text>
      )}
    </View>
*/

import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { AlbumType, ArtistType, TrackType } from "@/types/index";
import { ArtistCard } from "@/app/_components/cards/ArtistCard";
import { toast } from "@/utils/toast";

type ArtistDataType = {
  artist: ArtistType;
  albums: AlbumType[];
};

const ITEMS_PER_PAGE = 5;

const Artists = () => {
  const [artists, setArtists] = useState<ArtistType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const db = useSQLiteContext();

  const loadArtists = async (currentOffset: number) => {
    try {
      console.log("loadArtists:", currentOffset);
      const artistsList: ArtistType[] = [];

      // for await (const row of db.getEachAsync('SELECT * FROM test')) {
      //   console.log(row.id, row.value, row.intValue);
      // }
      for await (const row of db.getEachAsync("SELECT * FROM artists")) {
        if (row && typeof row === "object") {
          artistsList.push(row as ArtistType);
          console.log("artist added:", row);
        }
      }

      // 더 로드할 데이터가 있는지 확인
      if (artistsList.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      return artistsList;
    } catch (error) {
      console.error("Artists 로딩 에러:", error);
      return [];
    }
  };

  const deleteArtist = async (id: string) => {
    try {
      await db.runAsync("DELETE FROM artists WHERE id = ?", [id]);
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

  // 추가 데이터 로드
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextOffset = offset + ITEMS_PER_PAGE;
      const moreArtists = await loadArtists(nextOffset);

      setArtists((prev) => [...prev, ...moreArtists]);
      setOffset(nextOffset);
    } finally {
      setIsLoadingMore(false);
    }
  }, [offset, isLoadingMore, hasMore]);

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

  const renderItem = ({ item }: { item: ArtistType }) => (
    <ArtistCard artist={item} deleteArtist={deleteArtist} key={item.id} />
  );

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
        data={artists}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        // onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
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
