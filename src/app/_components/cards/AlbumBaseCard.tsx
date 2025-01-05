/*
2025-01-04 22:20:39

*/

import { View, Text } from "react-native";
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/libs/utils";

type ArtistBaseCardProps = {
  children: React.ReactNode;
  className?: string;
};

const AlbumBaseCard = ({ children, className }: ArtistBaseCardProps) => {
  return (
    <Card className={cn(className, "w-full max-w-md mx-auto my-4")}>
      {children}
    </Card>
  );
};

export default AlbumBaseCard;
