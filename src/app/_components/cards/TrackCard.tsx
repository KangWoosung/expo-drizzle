import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TrackType } from "@/types";
import { Link } from "expo-router";

type ApiTrackCardProps = {
  track: TrackType;
  artistId: string;
  handleSave: (track: TrackType, artistId: string) => Promise<void>;
  activeSource: string;
  role?: string;
};

export default function TrackCard({
  track,
  artistId,
  handleSave,
  activeSource,
  role,
}: ApiTrackCardProps) {
  // 밀리초를 분:초 형식으로 변환하는 함수
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto my-4">
      <CardHeader className="flex flex-row justify-between items-center pr-4 pb-2 bg-slate-50">
        {activeSource === "db" && role !== "master" ? (
          <>
            <Link href={`../../(tabs)/artists/tracks/${track?.id}`} asChild>
              <CardTitle className="text-2xl font-extrabold">
                {track?.title}
              </CardTitle>
            </Link>
            <Ionicons name="chevron-forward" size={24} color={"#64748b"} />
          </>
        ) : (
          <CardTitle className="text-2xl font-extrabold">
            {track?.title}
          </CardTitle>
        )}
      </CardHeader>

      <CardContent className="grid gap-4 pt-4">
        <View className="flex flex-row items-center gap-2">
          <Ionicons name="musical-note-outline" size={18} color={"#64748b"} />
          <Text className="text-lg text-slate-500">트랙 {track?.position}</Text>
        </View>

        <View className="flex flex-row items-center gap-2">
          <Ionicons name="time-outline" size={18} color={"#64748b"} />
          <Text className="text-lg text-slate-500">
            {formatDuration(track?.duration)}
          </Text>
        </View>

        {track?.disambiguation && (
          <View className="flex flex-row items-center gap-2">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={"#295491"}
            />
            <Text className="text-base text-muted-foreground">
              {track?.disambiguation}
            </Text>
          </View>
        )}

        <View className="flex flex-row justify-between items-left">
          <Badge variant="secondary" className="w-fit">
            <Text>ID: {track?.id}</Text>
          </Badge>
          {activeSource === "api" ? (
            <Pressable
              className="px-3 py-2 rounded-md"
              onPress={() => handleSave(track, artistId)}
            >
              <Ionicons name="save-outline" size={18} color={"#295491"} />
            </Pressable>
          ) : null}
        </View>
      </CardContent>
    </Card>
  );
}
