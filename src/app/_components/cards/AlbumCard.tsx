import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { InsertAlbumSchemaType } from "@/zod-schemas/albums";

type ApiAlbumCardProps = {
  album: InsertAlbumSchemaType;
  artistId: string;
  handleSave: (album: InsertAlbumSchemaType, artistId: string) => Promise<void>;
  deleteAlbum: (albumId: string) => void;
  activeSource: string;
  role?: string;
  trackCnt?: number;
};

export default function AlbumCard({
  album,
  artistId,
  handleSave,
  deleteAlbum,
  activeSource,
  role,
  trackCnt,
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
        {album.status ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="disc-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">{album.status}</Text>
          </View>
        ) : null}

        {album.country ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="flag-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">{album.country}</Text>
          </View>
        ) : null}

        {album.release_date ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">{album.release_date}</Text>
          </View>
        ) : null}

        {album.packaging ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">{album.packaging}</Text>
          </View>
        ) : null}

        {trackCnt ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons
              name="musical-notes-outline"
              size={18}
              color={"#64748b"}
            />
            <Text className="text-lg text-slate-500">{trackCnt} tracks</Text>
          </View>
        ) : null}

        {album.disambiguation ? (
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
        ) : null}

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
          ) : activeSource === "db" && !role ? (
            <Pressable
              className="px-3 py-2 rounded-md"
              onPress={() => deleteAlbum(album.id)}
            >
              <Ionicons name="trash-outline" size={20} color={"#295491"} />
            </Pressable>
          ) : null}
        </View>
      </CardContent>
    </Card>
  );
}
