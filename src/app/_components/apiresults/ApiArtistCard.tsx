import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/button";
import { useColorScheme } from "@/libs/useColorScheme";
import { getColors } from "@/constants/color";
// API 데이터를 직접 핸들하므로, API Type 을 사용한다.
import { ApiArtistSchemaType } from "@/zod-schemas/artists";

export default function ApiArtistCard({
  artist,
  handleSave,
}: {
  artist: ApiArtistSchemaType;
  handleSave: (artist: ApiArtistSchemaType) => void;
}) {
  const { colorScheme } = useColorScheme();
  const currentColors = getColors(colorScheme as "light" | "dark");

  return (
    <Card className="w-full max-w-md mx-auto my-4">
      <CardHeader className="pb-2 bg-slate-50">
        <View className="flex flex-row justify-between">
          <CardTitle className="text-2xl font-extrabold">
            {artist.name}
          </CardTitle>
          {artist.score !== undefined ? (
            <View className="flex items-center space-x-1">
              <Text className="text-sm font-medium">Score:</Text>
              <Text className="text-lg font-bold">{artist.score}</Text>
              <Text className="text-xs text-muted-foreground">/100</Text>
            </View>
          ) : null}
        </View>
        {artist.sortName && artist.sortName !== artist.name ? (
          <Text className="text-sm text-muted-foreground">
            {artist.sortName}
          </Text>
        ) : null}
      </CardHeader>

      <CardContent className="grid gap-4 pt-4">
        {artist.type ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="people-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">{artist.type}</Text>
          </View>
        ) : null}

        {artist.country ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="flag-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">{artist.country}</Text>
          </View>
        ) : null}

        {artist.beginDate || artist.endDate ? (
          <View className="flex items-left space-x-2">
            <Text className="text-sm">
              {artist.beginDate || "Unknown"} - {artist.endDate || "Present"}
            </Text>
          </View>
        ) : null}

        {artist.disambiguation ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={"#295491"}
            />
            <Text className="text-base text-muted-foreground">
              {artist.disambiguation}
            </Text>
          </View>
        ) : null}

        <View className="flex flex-row justify-between items-left">
          <Badge variant="secondary" className="w-fit">
            <Text>ID: {artist.id}</Text>
          </Badge>
          <Pressable
            className="px-3 py-2 border rounded-md"
            onPress={() => handleSave(artist)}
          >
            <Ionicons name="save-outline" size={18} color={"#295491"} />
          </Pressable>
        </View>
      </CardContent>
    </Card>
  );
}
