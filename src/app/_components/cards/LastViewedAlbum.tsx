import { View, Text } from "react-native";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Ionicons } from "@expo/vector-icons";
import { Badge } from "@/components/ui/badge";
import { useColorScheme } from "nativewind";
import { getColors } from "@/constants/color";
import { SelectAlbumSchemaType } from "@/zod-schemas/albums";

type LastViewedAlbumProps = {
  lastAlbum: SelectAlbumSchemaType;
};

const LastViewedAlbum = ({ lastAlbum }: LastViewedAlbumProps) => {
  const { colorScheme } = useColorScheme();
  const currentColors = getColors(colorScheme as "light" | "dark");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar alt="Last viewed album avatar">
          <AvatarFallback>
            <Ionicons
              name="book-outline"
              size={24}
              color={currentColors.foreground}
            />
          </AvatarFallback>
        </Avatar>
        <Text className="font-base text-gray-500 text-xl">
          Last Viewed Album
        </Text>
      </CardHeader>
      <CardContent>
        <Text className="font-bold text-2xl mb-2">{lastAlbum?.title}</Text>
        {/* DB Albums 에는 date 가 없다.
         {lastAlbum?.date ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">{lastAlbum?.date}</Text>
          </View>
        ) : null} */}
        {lastAlbum?.disambiguation ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={"#64748b"}
            />
            <Text className="text-lg text-slate-500">
              {lastAlbum?.disambiguation}
            </Text>
          </View>
        ) : null}
        {/* DB Albums 에는 quality 가 없다.
        {lastAlbum?.quality ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={"#64748b"}
            />
            <Text className="text-lg text-slate-500">{lastAlbum?.quality}</Text>
          </View>
        ) : null} */}
        {lastAlbum?.packaging ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={"#64748b"}
            />
            <Text className="text-lg text-slate-500">
              {lastAlbum?.packaging}
            </Text>
          </View>
        ) : null}
        <Badge variant="secondary" className="w-fit">
          <Text>ID: {lastAlbum?.id}</Text>
        </Badge>
      </CardContent>
    </Card>
  );
};

export default LastViewedAlbum;
