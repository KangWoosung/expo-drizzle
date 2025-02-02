import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useArtistAlbumZustand } from "@/contexts/ArtistAlbumZustand";
import {
  InsertAlbumSchemaType,
  SelectAlbumSchemaType,
} from "@/zod-schemas/albums";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

interface DBAlbumCardProps {
  album: SelectAlbumSchemaType;
}

export default function DBAlbumCard({ album }: DBAlbumCardProps) {
  const { artistZustandObj: artistObj, albumZustandObj: albumObj } =
    useArtistAlbumZustand();

  return (
    <Card className="w-full max-w-md mx-auto my-4 ">
      <CardHeader className="pb-2 bg-slate-50">
        <View className="flex flex-row justify-between">
          <CardTitle className="text-2xl font-extrabold">
            {artistObj.name}
          </CardTitle>
          {/* DB 에는 artists.score 가 없다.
          {artistObj.score !== undefined ? (
            <View className="flex items-center space-x-1">
              <Text className="text-sm font-medium">Score:</Text>
              <Text className="text-lg font-bold">{artistObj.score}</Text>
              <Text className="text-xs text-muted-foreground">/100</Text>
            </View>
          ) : null} */}
        </View>
        {artistObj.sortName && artistObj.sortName !== artistObj.name ? (
          <Text className="text-sm text-muted-foreground">
            {artistObj.sortName}
          </Text>
        ) : null}
      </CardHeader>
      <CardContent className="grid gap-4 pt-4">
        {artistObj.type ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="people-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">{artistObj.type}</Text>
          </View>
        ) : null}
        {artistObj.country ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="flag-outline" size={18} color={"#64748b"} />
            <Text className="text-lg text-slate-500">{artistObj.country}</Text>
          </View>
        ) : null}
        {/* {artistObj.begin_date || artistObj.end_date ? (
          <View className="flex items-left space-x-2">
            // {/* <CalendarIcon className="h-4 w-4 text-muted-foreground" /> 
            <Text className="text-sm">
              {artistObj.begin_date || "Unknown"} -{" "}
              {artistObj.end_date || "Present"}
            </Text>
          </View>
        ) : null} */}
        {/* {artistObj.albumsCnt ? (
          <View className="flex flex-row justify-between">
            <View className="flex flex-row items-center gap-2">
              <Ionicons
                name="musical-note-outline"
                size={18}
                color={"#64748b"}
              />
              <Text className="text-sm">Albums: {artistObj.albumsCnt}</Text>
            </View>
            <Text className="text-sm">To Albums</Text>
          </View>
        ) : (
          <View className="flex flex-row justify-between ">
            <View className="flex flex-row items-center gap-2">
              <Ionicons
                name="musical-note-outline"
                size={18}
                color={"#64748b"}
              />
              <Text className="text-lg text-slate-500">
                Albums: {artistObj.albumsCnt ? artistObj.albumsCnt : 0}
              </Text>
            </View>
            <Link
              className="mx-6"
              href={`../../artistjs/detail/${artistObj.id}`}
            >
              <Ionicons
                name="arrow-down-circle-outline"
                size={24}
                color={"#295491"}
              />
            </Link>
          </View>
        )} */}
        {artistObj.disambiguation ? (
          <View className="flex flex-row items-center gap-2">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={"#295491"}
            />
            <Text className="text-base text-muted-foreground">
              {artistObj.disambiguation}
            </Text>
          </View>
        ) : null}
        {/* {tags && tags.length > 0 && <Tags tags={tags} />} */}
        <View className="flex flex-row justify-between items-left">
          <Badge variant="secondary" className="w-fit">
            <Text>ID: {artistObj.id}</Text>
          </Badge>
          <Pressable className="px-3 py-2 border rounded-md" onPress={() => {}}>
            <Ionicons name="trash-outline" size={20} color={"#295491"} />
          </Pressable>
        </View>
      </CardContent>
    </Card>
  );
}
