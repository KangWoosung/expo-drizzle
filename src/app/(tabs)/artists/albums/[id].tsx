/*
2025-01-09 04:33:15

0. albumId 로 albumCard 를 채워준다. 
1. DB 에서 트랙 데이터 가져오기를 시도하고, 없으면 API 에서 가져오기를
시도한다.
2. 트랙 데이터를 API 에서 가져옴과 동시에 DB 에 저장한다.
3. 이 모두를 사용자 액션 없이 알아서 처리한다.

2025-01-09 13:34:45
남은 작업 순서:
useArtistAlbumZustand 에, tracks 처리 오브젝트와 펑션을 추가해준다.
tracksZustandObj 에 tracks 데이터를 하나씩 할당해주는 
  외부 펑션 - instanceTracksZustandObj - 을 만들어준다.
이게 좀 복잡하긴 한데..
Json 트리의 다른 요소들은 무시하거나 나중에 처리하기로 하고,
result.media[0].tracks 에만 집중해보자. 그리고 나머지는 나중에 필요 여부를 판단하자.
result.media[0].tracks
  {
  "id": "e3179656-731c-4152-a95f-3c57b0694a23",
  "title": "Oh Sherrie",
  "number": "A",
  "position": 1,
  "length": 225000
}
length 가 null 일 수도 있다. 이 경우, 
result.media[0].tracks[i].recording[0]
  위치에, length, disambiguation, "first-release-date" 가 있다.
  그러므로, length 는, result.media[0].tracks[i].recording[0]["first-release-date"] 에서 가져오자.

2025-01-31 21:03:35
drizzle 포팅 작업 완료


*/

import { View, Text, Pressable, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useArtistAlbumZustand } from "@/contexts/ArtistAlbumZustand";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { getColors } from "@/constants/color";
import AlbumCard from "@/app/_components/cards/AlbumCard";
import { useSQLiteContext } from "expo-sqlite";
import { getTracksFromApi } from "@/utils/getTracksFromApi";
import { toast } from "@/utils/toast";
import TrackCard from "@/app/_components/cards/TrackCard";
import { MMKV } from "react-native-mmkv";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "@/db/drizzle/schema";
import {
  trackJoinReleaseSchema,
  TrackJoinReleaseType,
} from "@/zod-schemas/trackJoinRelease";
import { eq } from "drizzle-orm";
import {
  InsertAlbumSchemaType,
  SelectAlbumSchemaType,
} from "@/zod-schemas/albums";

const Album = () => {
  const { id } = useLocalSearchParams();
  const albumId = Array.isArray(id) ? id[0] : id;
  const [tracks, setTracks] = useState<TrackJoinReleaseType[]>([]);
  const [trackCnt, setTrackCnt] = useState<number>(0);
  const storage = new MMKV();
  const db = useSQLiteContext();
  const drizzleDB = drizzle(db, { schema });

  const { colorScheme } = useColorScheme();
  const currentColors = getColors(colorScheme as "light" | "dark");
  const {
    artistZustandObj,
    artistZustandId,
    setArtistZustandId,
    setArtistZustandObj,
    albumZustandObj,
    albumZustandId,
    setAlbumZustandId,
    setAlbumZustandObj,
  } = useArtistAlbumZustand();

  const getTracksWithRelease = async (trackId: string) => {
    const result = await drizzleDB
      .select()
      .from(schema.recordings)
      .leftJoin(
        schema.releaseRecordings,
        eq(schema.recordings.id, schema.releaseRecordings.recordingId)
      )
      .leftJoin(
        schema.releases,
        eq(schema.releaseRecordings.releaseId, schema.releases.id)
      )
      .where(eq(schema.recordings.id, trackId));

    return trackJoinReleaseSchema.parse(result);
  };

  useEffect(() => {
    if (!albumId) return;

    // 0. fill up Master albumCard with albumId
    const getAlbumProcess = async () => {
      setAlbumZustandId(albumId);
      const dbAlbum = await drizzleDB
        .select()
        .from(schema.releases)
        .where(eq(schema.releases.id, albumId));
      setAlbumZustandObj(dbAlbum[0] as InsertAlbumSchemaType);
      // MMKV Data update
      storage.set("lastViewedAlbum", JSON.stringify(dbAlbum));
    };
    // 1. try to get Track data from DB, if not, try to get from API
    const getTracks = async () => {
      // get tracks from DB
      const dbTracks = await getTracksWithRelease(albumId);
      if (dbTracks && dbTracks?.length > 0) {
        setTracks(dbTracks);
        setTrackCnt(dbTracks.length);
        console.log("Tracks from DB:", dbTracks.length);
      } else {
        // get tracks from API
        console.log("No tracks from DB, try to get from API");
        const result = await getTracksFromApi(albumId);
        if (result) {
          setTracks(result.media[0].tracks);
          setTrackCnt(result.media[0].tracks.length);
          console.log("트랙 세이브하러 갑니다.");
          saveTracksToDb(result.media[0].tracks, artistZustandId);
          // 토스트..
          toast.show(
            result.media[0].tracks.length + " Tracks fetched from API"
          );
        }
      }
    };
    getAlbumProcess();
    getTracks();
  }, [albumId]);

  // Update MMKV Count
  const updateTracksCnt = async () => {
    const newTotalCnt = tracks.length;
    storage.set("tracksCnt", newTotalCnt);
  };

  // 2. save Track data to DB as soon as it is fetched from API
  const saveTracksToDb = async (
    tracks: TrackJoinReleaseType[],
    artistId: string
  ) => {
    db.withTransactionAsync(async () => {
      try {
        // foreach 는 async await 와 함께 사용할 수 없다.
        for (const track of tracks) {
          // 트랙 저장
          const result1 = await drizzleDB
            .insert(schema.recordings)
            .values(track);
          // 앨범-트랙 저장
          const result2 = await drizzleDB
            .insert(schema.releaseRecordings)
            .values({
              releaseId: albumId,
              recordingId: track.id,
              trackPosition: track.trackPosition || 1,
            });
        }
        // Update MMKV Count
        await updateTracksCnt();
        // toaster
        toast.show("Tracks saved to DB");
      } catch (error) {
        console.error("Error saving tracks to DB:", error);
      }
    });
  };

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

        <AlbumCard
          album={albumZustandObj}
          artistId={artistZustandId}
          handleSave={async (
            album: InsertAlbumSchemaType,
            artistId: string
          ) => {}}
          deleteAlbum={() => albumId}
          activeSource={"db"}
          role={"master"}
          trackCnt={trackCnt}
        />

        <FlatList
          data={tracks}
          renderItem={({ item }) => (
            <TrackCard
              track={item}
              artistId={artistZustandId}
              handleSave={async (
                track: TrackJoinReleaseType,
                artistId: string
              ) => {}}
              activeSource={"db"}
            />
          )}
        ></FlatList>
      </View>
    </>
  );
};

export default Album;
