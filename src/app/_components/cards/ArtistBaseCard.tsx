/*
2025-01-04 08:49:55

Use encapsulating instead of abstraction in react moduling!!
섣부른 추상화가 프로젝트를 복잡하게 만든다. 캡슐화가 더 효과적이다.

*/

import { View, Text } from "react-native";
import React, { Children } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/libs/utils";

type ArtistBaseCardProps = {
  children: React.ReactNode;
  className?: string;
};

const ArtistBaseCard = ({ children, className }: ArtistBaseCardProps) => {
  return (
    <Card className={cn(className, "w-full max-w-md mx-auto my-4")}>
      {children}
    </Card>
  );
};

export default ArtistBaseCard;
