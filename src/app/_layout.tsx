import {
  Appearance,
  Image,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Suspense, useEffect, useState } from "react";
import { Stack } from "expo-router";
import "../styles/global.css";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  GestureHandlerRootView
} from "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { avatarObj } from "@/constants/assets";
import { appName, iconSize } from "../constants/tokens";
import { useColorScheme } from "nativewind";
import { getColors } from "../constants/color";
import RootLayout from "./_components/RootLayout";
import RootStackLayout from "./_components/RootLayout";
import { SQLiteProvider } from "expo-sqlite";
import { QueryClientProvider } from "@tanstack/react-query";
import {initDatabase} from "../db";
import { queryClient } from "@/libs/query-client";
import { DB_NAME } from "@/constants/db";
import MigrationFallback from "@/components/fallbacks/MigrationFallback";
const defaultAvatar = require("../assets/images/default-avatar.png");

const Layout = () => {
  const [avatar, setAvatar] = useState({ uri: "" });
  const [noticeCnt, setNoticeCnt] = useState(0);

  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();

  // Async Data Fetching 을 나중에 추가...
  useEffect(() => {
    setAvatar({ uri: avatarObj.uri });
    setNoticeCnt(1);
  }, []);

  return (
    // <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
    // </NavigationContainer>
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar animated style={colorScheme === "dark" ? "light" : "dark"} />
        <Suspense fallback={<MigrationFallback />}>
          <SQLiteProvider databaseName={DB_NAME} onInit={initDatabase} useSuspense>
            <QueryClientProvider client={queryClient}>
              <RootStackLayout
                avatar={avatar}
                noticeCnt={noticeCnt}
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
              />
            </QueryClientProvider>
          </SQLiteProvider>
        </Suspense>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};


export default Layout;
