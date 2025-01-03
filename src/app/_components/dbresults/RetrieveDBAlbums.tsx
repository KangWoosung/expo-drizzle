/*
2025-01-03 01:56:30


*/

import { View, Text, Pressable } from "react-native";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Ionicons } from "@expo/vector-icons";

type RetrieveApiAlbumsProps = {
  retrieveDBAlbums: (value: boolean) => void;
  showDbTrigger: boolean;
  DBAlbumsCnt: number;
  setActiveSource: (value: string) => void;
  activeSource: string;
};

const RetrieveDBAlbums = ({
  retrieveDBAlbums,
  showDbTrigger,
  DBAlbumsCnt,
  setActiveSource,
  activeSource,
}: RetrieveApiAlbumsProps) => {
  return (
    <View>
      {activeSource !== "db" ? (
        <Card className="w-full max-w-md mx-auto my-4">
          <CardContent className="py-4">
            <Text className="text-xl font-base">
              DB 에 {DBAlbumsCnt || 0} 개의 앨범이 보관되어 있습니다.
            </Text>
          </CardContent>
          <CardContent className="py-4">
            <Pressable
              className="flex flex-row items-center gap-2 rounded-full px-3 py-2 bg-slate-200"
              onPress={() => retrieveDBAlbums(true)}
            >
              <Ionicons
                name="folder-open-outline"
                size={18}
                color={"#295491"}
              />
              <Text>DB 데이터 열기</Text>
            </Pressable>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md mx-auto my-4 border-solid border-4 border-slate-500">
          <CardContent className="py-4">
            <Text className="text-xl font-base">
              DB 데이터 앨범: {DBAlbumsCnt || 0} 개
            </Text>
          </CardContent>
        </Card>
      )}
    </View>
  );
};

export default RetrieveDBAlbums;
