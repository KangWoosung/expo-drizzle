/*
2025-01-03 01:50:22


*/

import { View, Text, Pressable } from "react-native";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Ionicons } from "@expo/vector-icons";

type RetrieveApiAlbumsProps = {
  showApiTrigger: boolean;
  setShowApiTrigger: (value: boolean) => void;
  apiAlbumsCnt: number;
  retrieveApiAlbums: () => void;
  setActiveSource: (value: string) => void;
  activeSource: string;
};

const RetrieveApiAlbums = ({
  showApiTrigger,
  apiAlbumsCnt,
  retrieveApiAlbums,
  setActiveSource,
  activeSource,
}: RetrieveApiAlbumsProps) => {
  return (
    <View>
      {activeSource !== "api" ? (
        <Card className="w-full max-w-md mx-auto my-4">
          <CardContent className="py-4">
            <Pressable
              className="flex flex-row items-center gap-2 rounded-full px-3 py-2 bg-slate-200"
              onPress={retrieveApiAlbums}
            >
              <Ionicons
                name="cloud-download-outline"
                size={18}
                color={"#295491"}
              />
              <Text>API 데이터 가져오기</Text>
            </Pressable>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md mx-auto my-4 border-solid border-4 border-slate-500">
          <CardContent className="py-4">
            <Text className="text-xl font-base">
              API 에서 가져온 앨범 데이터 {apiAlbumsCnt} 개
            </Text>
          </CardContent>
        </Card>
      )}
    </View>
  );
};

export default RetrieveApiAlbums;
