/*
2025-01-05 20:04:42

Album 의 모든 트랙 정보를 DB 에서 가져와 출력해준다.

초기 상태로는, DB 에 트랙 데이터가 없다. 
1. DB data 가 없을 때, onLoad 에서 API 를 호출해준다.
2. API 의 트랙 data 가 확보되는 즉시 DB.recordings 에 저장해준다.
    tags 가 있을 경우, tags 도 저장해준다.
3. DB.recordings 에 저장된 데이터를 화면에 출력해준다.

Param: albumId
API URL:
https://musicbrainz.org/ws/2/release/[albumId]?inc=recordings&fmt=json

Page 에서 처리해줘야 할 일:
1. albumId 에 해당하는 DB 의 recordings 데이터를 가져와준다.
2. DB 에 데이터가 없을 경우, API 를 호출해준다.
3. data 목록을 출력해준다.
4. 

*/

import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { TrackType } from "@/types";

const index = () => {
  const albumId = useLocalSearchParams();
  // 1. DB data 가 없을 때, onLoad 에서 API 를 호출해준다.
  const [recordings, setRecordings] = useState<TrackType[]>([]);

  const { data, error, isLoading } = useQuery({
    queryKey: ["searchAlbum", albumId],
    queryFn: async () => {
      const response = await fetch(
        `https://musicbrainz.org/ws/2/release/${albumId}?inc=recordings&fmt=json`,
        {
          headers: {
            "User-Agent": "Hoerzu/1.0.0 ( http://hoerzu.example.com )",
            From: "Hoerzu/1.0.0 ( me@hoerzu.com )",
          },
        }
      );
      const data = await response.json();
      setRecordings(data.recordings);
    },
  });

  const saveTracks = async (tracks: TrackType[]) => {
    // 2. API 의 트랙 data 가 확보되는 즉시 DB.recordings 에 저장해준다.
    //    tags 가 있을 경우, tags 도 저장해준다.
    console.log("saveTracks:", tracks);
  };

  return (
    <View>
      <Text>Album Track List</Text>
      {isLoading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {/* 
      <FlatList
        data={albumsData || []}
        renderItem={({ item }) => (
          <DBAlbumCard
            album={item}
            artistId={Array.isArray(artistId) ? artistId[0] : artistId}
            handleSave={handleSave}
          />
        )}
        keyExtractor={(item) => item.id}
      /> */}
    </View>
  );
};

export default index;
