import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AlbumType } from "@/types";
import { Link } from "expo-router";

type ApiAlbumCardProps = {
  album: AlbumType;
  artistId: string;
  handleSave: (album: AlbumType, artistId: string) => Promise<void>;
  activeSource: string;
  role?: string;
};

export default function AlbumCard({
  album,
  artistId,
  handleSave,
  activeSource,
  role,
}: ApiAlbumCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto my-4">
      <CardHeader className="flex flex-row justify-between items-center pr-4 pb-2 bg-slate-50">
        {activeSource === "db" && role !== "master" ? (
          <>
            <Link href={`../../(tabs)/artists/albums/${album.id}`} asChild>
              <CardTitle className="text-2xl font-extrabold">
                {album.title}
              </CardTitle>
            </Link>
            <Ionicons name="chevron-forward" size={24} color={"#64748b"} />
          </>
        ) : (
          <CardTitle className="text-2xl font-extrabold">
            {album.title}
          </CardTitle>
        )}
      </CardHeader>

      <CardContent className="grid gap-4 pt-4">
        {album.status && (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="disc-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">{album.status}</Text>
          </View>
        )}

        {album.country && (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="flag-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">{album.country}</Text>
          </View>
        )}

        {album.date && (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">{album.date}</Text>
          </View>
        )}

        {album.packaging && album.packaging !== "None" && (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">{album.packaging}</Text>
          </View>
        )}

        {album.disambiguation && (
          <View className="flex flex-row items-center gap-2">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={"#295491"}
            />
            <Text className="text-base text-muted-foreground">
              {album.disambiguation}
            </Text>
          </View>
        )}

        <View className="flex flex-row justify-between items-left">
          <Badge variant="secondary" className="w-fit">
            <Text>ID: {album.id}</Text>
          </Badge>
          {activeSource === "api" ? (
            <Pressable
              className="px-3 py-2 rounded-md"
              onPress={() => handleSave(album, artistId)}
            >
              <Ionicons name="save-outline" size={18} color={"#295491"} />
            </Pressable>
          ) : null}
        </View>
      </CardContent>
    </Card>
  );
}
