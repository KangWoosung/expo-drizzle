/*
2025-01-03 04:01:03



*/

import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Badge } from "@/components/ui/badge";

type TagsProps = {
  tags: string[];
};

const Tags = ({ tags }: TagsProps) => {
  let kid = 0;
  return (
    <View className="flex flex-row items-center gap-2">
      <Ionicons name="information-circle-outline" size={18} color={"#295491"} />
      <Text className="text-base text-muted-foreground">
        {tags.map((tag) => (
          <Badge variant="secondary" className="w-fit" key={kid++}>
            <Text>{tag}</Text>
          </Badge>
        ))}
      </Text>
    </View>
  );
};

export default Tags;
