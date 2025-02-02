import { View, Text } from "react-native";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Ionicons } from "@expo/vector-icons";
import { Badge } from "@/components/ui/badge";
import { useColorScheme } from "nativewind";
import { getColors } from "@/constants/color";
import { SelectArtistSchemaType } from "@/zod-schemas/artists";

type LastViewedArtistProps = {
  lastArtist: SelectArtistSchemaType;
};

const LastViewedArtist = ({ lastArtist }: LastViewedArtistProps) => {
  const { colorScheme } = useColorScheme();
  const currentColors = getColors(colorScheme as "light" | "dark");

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center space-x-4 gap-2 pb-2">
        <Avatar alt="Last viewed artist avatar">
          <AvatarFallback>
            <Ionicons
              name="person-outline"
              size={24}
              color={currentColors.foreground}
            />
          </AvatarFallback>
        </Avatar>
        <Text className="font-base text-gray-500 text-xl">
          Last Viewed Artist
        </Text>
      </CardHeader>

      <CardContent className="grid gap-1 pt-0">
        <Text className="font-bold text-2xl mb-0">{lastArtist?.name}</Text>
        {lastArtist?.type ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="people-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">{lastArtist?.type}</Text>
          </View>
        ) : null}
        {lastArtist?.country ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="flag-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">
              {lastArtist?.country}
            </Text>
          </View>
        ) : null}
        {lastArtist?.disambiguation ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={"#295491"}
            />
            <Text className="text-base text-muted-foreground">
              {lastArtist?.disambiguation}
            </Text>
          </View>
        ) : null}
        <Badge variant="secondary" className="w-fit">
          <Text>ID: {lastArtist?.id}</Text>
        </Badge>
      </CardContent>
    </Card>
  );
};

export default LastViewedArtist;
