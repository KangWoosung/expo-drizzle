import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { getColors } from "@/constants/color";

type IndexStatsProps = {
  artistsCnt: number;
  albumsCnt: number;
  tracksCnt: number;
};

const IndexStats = ({ artistsCnt, albumsCnt, tracksCnt }: IndexStatsProps) => {
  const { colorScheme } = useColorScheme();
  const currentColors = getColors(colorScheme as "light" | "dark");

  return (
    <View className="flex flex-row gap-4 mb-6">
      <StatItem
        icon={
          <Ionicons
            name="person-outline"
            size={24}
            color={currentColors.foreground}
          />
        }
        label="Favorite Artists"
        value={artistsCnt}
      />
      <StatItem
        icon={
          <Ionicons
            name="book-outline"
            size={24}
            color={currentColors.foreground}
          />
        }
        label="Favorite Albums"
        value={albumsCnt}
      />
      <StatItem
        icon={
          <Ionicons
            name="musical-note"
            size={24}
            color={currentColors.foreground}
          />
        }
        label="Total Tracks"
        value={tracksCnt}
      />
    </View>
  );
};

export default IndexStats;

type StatItemProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
};

const StatItem = ({ icon, label, value }: StatItemProps) => (
  <View className="flex flex-col items-center justify-center bg-background p-4 rounded-lg shadow">
    {icon}
    <Text className="text-base font-base text-gray-500 mt-2">{label}</Text>
    <Text className="font-extralight text-5xl text-gray-700 mt-2">{value}</Text>
  </View>
);
