/*
2024-12-31 02:36:25

Dynamic Route:
/src/app/(tabs)/artists/detail/[id].tsx

여기는, DB 의 아티스트 상세 페이지입니당. 
아티스트의 앨범들을 DB 또는 API 에서 선택적으로 출력해줄 수 있습니다.

2025-01-03 02:06:05
1. 구조가, 구성이 너무 안좋다. 구조와 구성을 바꾸자. 3단 구성으로 바꾸자.
2. 상단에, n 개의 앨범이 저장되어 있습니다 & DB 데이터 열기
3. API 데이터 가져오기 버튼,
4. API Result Data 출력

2025-01-03 02:21:19
* DB 구조에 대한 정리:
1. tags 테이블에서는 tag string 과 id 만을 관리. 
2. artists 와 tags 의 관계는 artist_tags 테이블에서 관리.
3. releases 와 tags 의 관계는 release_tags 테이블에서 관리.
4. recordings 와 tags 의 관계는 recording_tags 테이블에서 관리.

* Save Icon Click 에 처리해야 할 일들:
1. Insert into artists table
2. Insert into releases (albums) table
3. Insert into recordings (tracks) table
4. Insert into tags table
5. Insert into artist_credits table
6. Insert into artist_tags table
7. Insert into release_tags table
8. Insert into release_recordings table 
9. Insert into recording_tags table

이제, 각각의 Case 에 대한 처리 루틴들을 정리해주자.
A. insert into artists 처리 transaction:
  1. Insert into artists table
  2. if(artist.tags) { 
  2-1. Insert into tags table 
  2-2. Insert into artist_tags table
  }
B. insert into releases (albums) 처리 transaction:
  1. Insert into releases table
  2. if(release.tags) { albums 에는 태그가 없다. 없다고 믿자. }
  2-1. Insert into tags table
  2-2. Insert into release_tags table
  }
C. insert into recordings (tracks) 처리 transaction:
  1. Insert into recordings table             -- 트랙 insert
      length          : media[i].tracks[i].length
  2. track 과 album 의 관계 테이블에 insert 해줘야 한다. 
  2-1. Insert into release_recordings         -- 앨범과 트랙의 관계 테이블에 insert
  2-2. track position, disc number 를 넣어줘야 한다.
      track_position  : media[i].tracks[i].position
      disc_number     : 이건 무시하자 default 1 임.
  3. if(recording.tags) {
  3-1. Insert into tags table
  3-2. Insert into recording_tags table
  ** 추가!! 트랙에 피쳐링 아티스트가 있는 경우, artist_credits 테이블에도 추가해줘야 한다.
  4. Insert into artist_credits table
  실제 사례 Json 의 데이터를 보고 난 후에 작업을 할지 말지 결정하기로 하자.
  }


본, 메인 컴포넌트에서 처리해줘야 할 중요 과제:
B. insert into releases (albums) 처리 transaction:
  1. Insert into releases table
  2. if(release.tags) {
  앨범에는 태그가 없다. 없다고 믿자.
  }

2025-01-03 21:39:34
그리고 한가지 더...
DB 와 API 를 토글 해줘야 한다. 
각 State data 들.. 
1. DB 에서 가져온 앨범 데이터
2. DB 에서 가져온 앨범 데이터 개수
  현재 State 에 관계없이 항상 필요하다.
3. API 에서 가져온 앨범 데이터


*/

import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack, Tabs, useLocalSearchParams } from "expo-router";
import { Card, CardContent } from "@/components/ui/card";
import { useSQLiteContext } from "expo-sqlite";
import { useQuery } from "@tanstack/react-query";
import AlbumCard from "@/app/_components/cards/AlbumCard";
import { FlatList } from "react-native";
import { AlbumType, ArtistType, ReleasesType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import RetrieveApiAlbums from "@/app/_components/apiform/RetrieveApiAlbums";
import RetrieveDBAlbums from "@/app/_components/dbresults/RetrieveDBAlbums";
import { useAlbumsRepository } from "@/db/repositories/albumsRepository";
import { toast } from "@/utils/toast";
import { useArtistAlbumZustand } from "@/contexts/ArtistAlbumZustand";
import { useArtistsRepository } from "@/db";
import { getColors } from "@/constants/color";
import { useColorScheme } from "nativewind";
import { useArtistAlbumsApi } from "@/hooks/useArtistAlbumsApi";
import { useArtistAlbumsDb } from "@/hooks/useArtistAlbumsDb";

const ArtistDetail = () => {
  const { id } = useLocalSearchParams();
  // artistId를 항상 문자열로 처리하도록 변환
  const artistId = Array.isArray(id) ? id[0] : id;
  const [showApiTrigger, setShowApiTrigger] = useState(false);
  const [showDbTrigger, setShowDbTrigger] = useState(false);
  const [apiAlbumsCnt, setApiAlbumsCnt] = useState<number>(0);
  const [DBAlbumsCnt, setDBAlbumsCnt] = useState<number>(0);
  const [albumsData, setAlbumsData] = useState<AlbumType[] | null>(null);
  const [activeSource, setActiveSource] = useState<string>("");
  const db = useSQLiteContext();
  const artistsRepository = useArtistsRepository(db);
  const albumsRepository = useAlbumsRepository(db);
  const {
    setArtistZustandId,
    setArtistZustandObj,
    artistZustandObj,
    artistZustandId,
  } = useArtistAlbumZustand();
  const { colorScheme } = useColorScheme();
  const currentColors = getColors(colorScheme as "light" | "dark");

  console.log("artistId:", artistId);
  console.log("showApiTrigger:", showApiTrigger);
  console.log("showDbTrigger:", showDbTrigger);

  // useEffect : artistId, artistObj 를 zustand 전역 상태로 로드한다.
  useEffect(() => {
    if (!artistId) return;
    setArtistZustandId(artistId);
    const loadArtistZustand = async () => {
      const artistObj = (await artistsRepository.selectById(
        artistId
      )) as ArtistType;
      artistObj && setArtistZustandObj(artistObj);
    };
    loadArtistZustand();
  }, [artistId]);

  // API Query
  const {
    data: apiData,
    isLoading: apiIsLoading,
    error: apiError,
  } = useArtistAlbumsApi(artistId, showApiTrigger, setAlbumsData);

  // DB Query
  const {
    albums: dbData,
    isLoading: dbIsLoading,
    error: dbError,
    count: albumsCnt,
    isCountLoading: dbCountIsLoading,
    countError: dbCountError,
  } = useArtistAlbumsDb(artistId, showDbTrigger, setAlbumsData);

  // DBAlbumsCnt state 업데이트
  useEffect(() => {
    setDBAlbumsCnt(albumsCnt);
  }, [albumsCnt]);

  // Save Album to DB
  const handleSave = async (album: AlbumType, artistId: string) => {
    console.log("handleSave:", album);
    // Insert into releases table
    try {
      // 1. insert into releases table
      const albumWithArtistId = { ...album, artistId };
      await albumsRepository.insert(albumWithArtistId);
      // 2. 앨범에는 태그가 없다. 없다고 믿자.
      // 3. Update albums count state
      setDBAlbumsCnt((prev) => prev + 1);
      // 4. 토스트 메시지
      toast.show("Album saved: " + album.title);
    } catch (error) {
      console.error("Error inserting albums:", error);
    }
  };

  // Fetch & UI Re-rendering
  const retrieveApiAlbums = async () => {
    setActiveSource("api");
    setAlbumsData(null);
    setShowDbTrigger(false);
    setShowApiTrigger(true);
    apiData && setApiAlbumsCnt(apiData?.releases.length);
  };

  // Query DB & UI Re-rendering
  const retrieveDBAlbums = async () => {
    setActiveSource("db");
    setAlbumsData(null);
    setShowDbTrigger(true);
    setShowApiTrigger(false);
  };
  // console.log("apiIsLoading:", apiIsLoading);
  // console.log("dbIsLoading:", dbIsLoading);

  return (
    <>
      <View className="flex-1">
        <Pressable
          className="flex flex-row px-8 gap-4"
          onPress={() => router.back()}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={currentColors.foreground}
          />
          <Text
            className="text-2xl text-foreground"
            style={{ color: currentColors.foreground }}
          >
            {artistZustandObj.name}
          </Text>
        </Pressable>
        <RetrieveDBAlbums
          retrieveDBAlbums={retrieveDBAlbums}
          showDbTrigger={showDbTrigger}
          DBAlbumsCnt={DBAlbumsCnt}
          setActiveSource={setActiveSource}
          activeSource={activeSource}
        />

        <RetrieveApiAlbums
          showApiTrigger={showApiTrigger}
          setShowApiTrigger={setShowApiTrigger}
          retrieveApiAlbums={retrieveApiAlbums}
          apiAlbumsCnt={apiAlbumsCnt}
          setActiveSource={setActiveSource}
          activeSource={activeSource}
        />

        {apiIsLoading || dbIsLoading ? (
          <Card className="w-full max-w-md mx-auto my-4">
            <CardContent className="py-4">
              <Text>앨범 데이터를 가져오는 중...</Text>
            </CardContent>
          </Card>
        ) : (
          <FlatList
            data={albumsData || []}
            renderItem={({ item }) => (
              <AlbumCard
                album={item}
                artistId={Array.isArray(artistId) ? artistId[0] : artistId}
                handleSave={handleSave}
                activeSource={activeSource}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </>
  );
};

export default ArtistDetail;
