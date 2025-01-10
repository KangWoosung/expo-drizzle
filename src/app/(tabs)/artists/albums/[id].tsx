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




*/

import { View, Text, Pressable, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useArtistAlbumZustand } from "@/contexts/ArtistAlbumZustand";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { getColors } from "@/constants/color";
import AlbumCard from "@/app/_components/cards/AlbumCard";
import { useAlbumsRepository } from "@/db/repositories/albumsRepository";
import { AlbumType, TrackObjType, TrackType } from "@/types";
import { useSQLiteContext } from "expo-sqlite";
import { useTracksRepository } from "@/db";
import { TagType, TrackAndTagType } from "@/types/tagType";
import { getTracksFromApi } from "@/utils/getTracksFromApi";
import { toast } from "@/utils/toast";
import TrackCard from "@/app/_components/cards/TrackCard";
import { MMKV } from "react-native-mmkv";

/*
{
  "id": "e3179656-731c-4152-a95f-3c57b0694a23",
  "title": "Oh Sherrie",
  "number": "A",
  "position": 1,
  "length": 225000
}
*/
/*
length 가 null 일 수도 있다. 이 경우, 
result.media[0].tracks[i].recording[0]
  위치에, length, disambiguation, "first-release-date" 가 있다.
  그러므로, length 는, result.media[0].tracks[i].recording[0]["first-release-date"] 에서 가져오자.
  
*/

const Album = () => {
  const { id } = useLocalSearchParams();
  const albumId = Array.isArray(id) ? id[0] : id;
  const [tracks, setTracks] = useState<TrackObjType[]>([]);
  const [trackCnt, setTrackCnt] = useState<number>(0);
  const storage = new MMKV();
  const db = useSQLiteContext();
  const albumRepo = useAlbumsRepository(db);
  const trackRepo = useTracksRepository(db);
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

  useEffect(() => {
    if (!albumId) return;
    // 0. fill up Master albumCard with albumId
    const getAlbumProcess = async () => {
      setAlbumZustandId(albumId);
      const dbAlbum = await albumRepo.selectByAlbumId(albumId);
      setAlbumZustandObj(dbAlbum);
      // MMKV Data update
      storage.set("lastViewedAlbum", JSON.stringify(dbAlbum));
    };
    // 1. try to get Track data from DB, if not, try to get from API
    const getTracks = async () => {
      // get tracks from DB
      const dbTracks = await trackRepo.selectTracksByAlbumId(albumId);
      if (dbTracks.length > 0) {
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
    const newTotalCnt = await trackRepo.totalCnt();
    storage.set("tracksCnt", newTotalCnt);
  };

  // 2. save Track data to DB as soon as it is fetched from API
  const saveTracksToDb = async (tracks: TrackObjType[], artistId: string) => {
    // console.log("Before Transaction to save tracks to DB");
    db.withTransactionAsync(async () => {
      try {
        // console.log("before foreach loop", tracks[1].title);
        // foreach 는 async await 와 함께 사용할 수 없다.
        for (const track of tracks) {
          const result1 = await trackRepo.insertTrack(track, artistId);
          // console.log("Track inserted:", result1);
          // release_recordings 테이블이 누락되었다.
          const result2 = await trackRepo.insertReleaseRecordings(
            albumId,
            track.id,
            track.position
          );
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
          handleSave={async (album: AlbumType, artistId: string) => {}}
          deleteAlbum={() => albumId}
          activeSource={"db"}
          role={"master"}
          trackCnt={trackCnt}
        />

        <FlatList
          data={tracks}
          renderItem={({ item }) => (
            <TrackCard
              track={item as unknown as TrackObjType}
              artistId={artistZustandId}
              handleSave={async (track: TrackObjType, artistId: string) => {}}
              activeSource={"db"}
            />
          )}
        ></FlatList>
      </View>
    </>
  );
};

export default Album;
