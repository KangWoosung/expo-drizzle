import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { formatDuration } from "@/utils/timeFormatFunctions";
import { TrackJoinReleaseType } from "@/zod-schemas/trackJoinRelease";

type ApiTrackCardProps = {
  track: TrackJoinReleaseType;
  artistId: string;
  handleSave: (track: TrackJoinReleaseType, artistId: string) => Promise<void>;
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
  return (
    <Card className="w-full max-w-md mx-auto my-4">
      <CardHeader className="flex flex-row justify-between items-center pr-4 pb-2 bg-slate-50">
        <CardTitle className="text-2xl font-extrabold">
          <Text>{track?.title}</Text>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 pt-4">
        <View className="flex flex-row items-center gap-2">
          <Ionicons name="musical-note-outline" size={18} color={"#64748b"} />
          <Text className="text-lg text-slate-500">
            트랙 {track?.trackPosition}
          </Text>
        </View>

        <View className="flex flex-row items-center gap-2">
          <Ionicons name="time-outline" size={18} color={"#64748b"} />
          <Text className="text-lg text-slate-500">
            {formatDuration(track.length || track.length || 0)}
          </Text>
        </View>

        {track.release_date ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">{track.release_date}</Text>
          </View>
        ) : null}

        {track.disambiguation ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={"#295491"}
            />
            <Text className="text-base text-muted-foreground">
              {track.disambiguation}
            </Text>
          </View>
        ) : null}

        <View className="flex flex-row justify-between items-left">
          <Badge variant="secondary" className="w-fit">
            <Text>ID: {track.id}</Text>
          </Badge>
        </View>
      </CardContent>
    </Card>
  );
}
