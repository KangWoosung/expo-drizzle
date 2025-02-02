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
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import RootStackLayout from "./_components/RootLayout";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/libs/query-client";
import MigrationFallback from "@/components/fallbacks/MigrationFallback";
import { Toaster } from "@/components/Toaster";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import migrations from "../db/drizzle/migrations/migrations";
import { ENV } from "@/constants/env";

// const defaultAvatar = require("../assets/images/default-avatar.png");

const Layout = () => {
  const [avatar, setAvatar] = useState({ uri: "" });
  const [noticeCnt, setNoticeCnt] = useState(0);

  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();

  const expoDB = openDatabaseSync(ENV.DB_NAME);
  const drizzleDB = drizzle(expoDB);
  const { success, error } = useMigrations(drizzleDB, migrations);

  // DrizzleStudio
  useDrizzleStudio(drizzleDB);

  // Async Data Fetching 을 나중에 추가...
  useEffect(() => {
    setAvatar({ uri: ENV.AVATAR_OBJ.uri });
    setNoticeCnt(1);
  }, []);

  return (
    // <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
    // </NavigationContainer>
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar
            animated
            style={colorScheme === "dark" ? "light" : "dark"}
          />
          <Suspense fallback={<MigrationFallback />}>
            <SQLiteProvider databaseName={ENV.DB_NAME} useSuspense>
              <QueryClientProvider client={queryClient}>
                <RootStackLayout
                  avatar={avatar}
                  noticeCnt={noticeCnt}
                  colorScheme={colorScheme}
                  toggleColorScheme={toggleColorScheme}
                  initialRouteName="(tabs)" // 추가
                />
              </QueryClientProvider>
            </SQLiteProvider>
          </Suspense>
        </ThemeProvider>
        <Toaster />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default Layout;
