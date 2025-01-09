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
import { AlbumType, TrackType } from "@/types";
import { useSQLiteContext } from "expo-sqlite";
import { useTracksRepository } from "@/db";
import { TagType, TrackAndTagType } from "@/types/tagType";
import { getTracksFromApi } from "@/utils/getTracksFromApi";
import { toast } from "@/utils/toast";
import TrackCard from "@/app/_components/cards/TrackCard";

function instanceTracksZustandObj(tracks: TrackType[]) {}

const Album = () => {
  const { id } = useLocalSearchParams();
  const albumId = Array.isArray(id) ? id[0] : id;
  const [tracks, setTracks] = useState<TrackAndTagType[]>([]);
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

  // 0. fill up albumCard with albumId
  useEffect(() => {
    if (!albumId) return;
    const getAlbumProcess = async () => {
      setAlbumZustandId(albumId);
      const dbAlbum = await albumRepo.selectByAlbumId(albumId);
      setAlbumZustandObj(dbAlbum);
    };
    getAlbumProcess();
  }, [albumId]);

  // 1. try to get Track data from DB, if not, try to get from API
  useEffect(() => {
    if (!albumId) return;
    const getTracks = async () => {
      // get tracks from DB
      const dbTracks = await trackRepo.selectTracksByAlbumId(albumId);
      if (dbTracks.length > 0) {
        const tracksWithTags: TrackAndTagType[] = dbTracks.map((track) => ({
          track,
          tags: [],
        }));
        setTracks(tracksWithTags);
        console.log("Tracks from DB:", tracksWithTags);
      } else {
        // get tracks from API
        console.log("No tracks from DB, try to get from API");
        const result = await getTracksFromApi(albumId);
        if (result) {
          // 여기서, tracks 의 데이터구조를 바꿔서 tracksZustandObj 에 넣어준다.
          setTracks(result.media[0].tracks);
          // saveTracksToDb(result);
          toast.show(result.length + " Tracks fetched from API");
        }
      }
    };
    getTracks();
  }, [albumId]);

  // 2. save Track data to DB as soon as it is fetched from API
  const saveTracksToDb = async (tracks: any) => {
    db.withTransactionAsync(async () => {
      try {
        tracks.forEach(async (track: any) => {
          await trackRepo.insertTrack(track);
          await trackRepo.insertTags(track.tags);
        });
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
          activeSource={"db"}
          role={"master"}
        />

        <FlatList
          data={tracks}
          renderItem={({ item }) => (
            <TrackCard
              track={item.track}
              artistId={artistZustandId}
              handleSave={async (track: TrackType, artistId: string) => {}}
              activeSource={"db"}
            />
          )}
        >
          <Text className="text-xl mx-6">
            1. DB 에서 트랙 데이터 가져오기를 시도하고, 없으면 API 에서
            가져오기를 시도한다.
          </Text>
          <Text className="text-xl mx-6">
            2. 트랙 데이터를 API 에서 가져옴과 동시에 DB 에 저장한다.
          </Text>
          <Text className="text-xl mx-6">{JSON.stringify(tracks)}</Text>
        </FlatList>
      </View>
    </>
  );
};

export default Album;
