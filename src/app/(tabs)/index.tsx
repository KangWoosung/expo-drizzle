/*
2025-01-11 02:19:17

마지막 코드 정리
1. data 캐시 문제를 useIsFocused 로 해결하였다.
   이 문제와 관련한 솔루션은 여러가지가 있는 것 같은데, 모두 테스트해볼 시간은 없었다.
   useIsFocused 가 가장 납득가는데, 왠지 불안한 느낌은 남는다.
   unmountOnBlur 는 소멸한 것 같다. 
2. stat, lastViewedArtist, lastViewedAlbum 를 컴포넌트로 분리하였다.

--끗--

Final Code Cleanup
1. Resolved data caching issues using useIsFocused.
   There seem to be several solutions related to this problem, but there wasn't time to test them all.
   useIsFocused seems most reasonable, though some uncertainty remains.
   unmountOnBlur appears to be deprecated.
2. Separated stats, lastViewedArtist and lastViewedAlbum into components.

--END--

*/

import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useArtistsGetTotal } from "@/hooks";
import { useArtistsRepository } from "@/db";
import { MMKV } from "react-native-mmkv";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { getColors } from "@/constants/color";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlbumType, ArtistType } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { appName, appPropaganda, iconSize } from "@/constants/tokens";
import { useIsFocused } from "@react-navigation/native";
import { Badge } from "@/components/ui/badge";
import LastViewedArtist from "../_components/cards/LastViewedArtist";
import LastViewedAlbum from "../_components/cards/LastViewedAlbum";
import IndexStats from "../_components/stats/IndexStats";

// Stack 은 디폴트 비헤이비어로 스크린이 캐시된다.
// 되돌아 왔을 때, MMKV 데이터는 업데이트되지 않는다.
// Stack screens are cached by default behavior.
// When returning, MMKV data is not updated.
const index = () => {
  const isFocused = useIsFocused(); // 현재 페이지가 활성화되었는지 확인
  const { colorScheme } = useColorScheme();
  const currentColors = getColors(colorScheme as "light" | "dark");
  const storage = new MMKV();

  // stats 관리를 위한 useState 추가
  const [artistsCnt, setArtistsCnt] = useState(0);
  const [albumsCnt, setAlbumsCnt] = useState(0);
  const [tracksCnt, setTracksCnt] = useState(0);
  const [lastArtist, setLastArtist] = useState<ArtistType | null>(null);
  const [lastAlbum, setLastAlbum] = useState<AlbumType | null>(null);

  // 현재 스크린이 활성화될 때마다, MMKV 데이터를 업데이트한다.
  // Updates MMKV data whenever current screen is activated.
  useEffect(() => {
    const tempArtistsCnt = storage.getNumber("artistsCnt");
    const tempAlbumsCnt = storage.getNumber("albumsCnt");
    const tempTracksCnt = storage.getNumber("tracksCnt");
    console.log("tempArtistsCnt:", tempArtistsCnt);
    console.log("tempAlbumsCnt:", tempAlbumsCnt);
    console.log("tempTracksCnt:", tempTracksCnt);
    setArtistsCnt(tempArtistsCnt ?? 0);
    setAlbumsCnt(tempAlbumsCnt ?? 0);
    setTracksCnt(tempTracksCnt ?? 0);

    const tempArtist = storage.getString("lastViewedArtist");
    const tempAlbum = storage.getString("lastViewedAlbum");

    if (tempArtist) {
      setLastArtist(JSON.parse(tempArtist));
    }
    if (tempAlbum) {
      setLastAlbum(JSON.parse(tempAlbum));
    }
  }, [isFocused]); // every time the screen is focused

  return (
    <View className="relative p-2 max-w-md mx-auto bg-gray-100 min-h-screen">
      <View className="mb-8 text-center">
        <Text className="text-3xl font-bold text-purple-800 mb-2">
          {appName}
        </Text>
        <Text className="text-base text-gray-600 italic">{appPropaganda}</Text>
      </View>

      <IndexStats
        artistsCnt={artistsCnt}
        albumsCnt={albumsCnt}
        tracksCnt={tracksCnt}
      />

      {/* DO NOT FORGET TO USE TERNARY OPERATOR INSTEAD OF LOGICAL OPERATOR */}
      {lastArtist ? <LastViewedArtist lastArtist={lastArtist} /> : null}

      {lastAlbum ? <LastViewedAlbum lastAlbum={lastAlbum} /> : null}

      {/* 화면 허전함 방지 로고 */}
      {/* Logo to prevent empty screen */}
      <View className="space-y-1 fixed -bottom-40 center ">
        <View className="flex flex-row justify-center items-center">
          <Ionicons
            name="logo-stackoverflow"
            size={iconSize.base}
            color={currentColors.foreground}
            className="mx-2"
          />
          <Text
            className="font-bold"
            style={{
              color: currentColors.foreground,
            }}
          >
            {appName}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default index;
