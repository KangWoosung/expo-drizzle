import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
// import { BlurView } from "expo-blur";
import { Slot, Tabs } from "expo-router";
import { iconSize } from "@/constants/tokens";
import { Platform, StyleSheet, View } from "react-native";

import { useColorScheme } from "nativewind";
import { getColors } from "@/constants/color";
import { useArtistAlbumZustand } from "@/contexts/ArtistAlbumZustand";
import { router } from "expo-router";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const currentColors = getColors(colorScheme as "light" | "dark");
  const { artistZustandObj, artistZustandId } = useArtistAlbumZustand();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false, // 탭 바 라벨 숨기기
          tabBarActiveTintColor: currentColors.primary,
          tabBarInactiveTintColor: currentColors.mutedForeground,
          tabBarStyle: {
            backgroundColor: currentColors.background,
            borderTopColor: currentColors.border,
          },
          headerStyle: {
            backgroundColor: currentColors.background,
          },
          headerTintColor: currentColors.foreground,
          headerBackground: () => <View style={StyleSheet.absoluteFill} />,
        }}
        // initialRouteName="index"
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerTitle: "Home Screen chopchop",
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <Ionicons size={iconSize.base} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search Musicians",
            headerShown: true,
            headerStyle: {
              backgroundColor: currentColors.background,
            },
            headerTintColor: currentColors.foreground,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={iconSize.base}
                name={focused ? "search-circle-outline" : "search-outline"}
                color={color}
              />
            ),
            headerLeft: () => (
              <Ionicons
                name="chevron-back"
                size={28}
                color={currentColors.foreground}
                style={{ marginLeft: 10 }}
                onPress={() => router.back()}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="artists"
          options={{
            title: "Artists Tada~",
            headerShown: true,
            headerStyle: {
              backgroundColor: currentColors.background,
            },
            headerTintColor: currentColors.foreground,
            tabBarIcon: ({ color }) => (
              <Ionicons
                size={iconSize.base}
                name="musical-notes"
                color={color}
              />
            ),
            headerLeft: () => (
              <Ionicons
                name="chevron-back"
                size={28}
                color={currentColors.foreground}
                style={{ marginLeft: 20, marginRight: 10 }}
                onPress={() => router.back()}
              />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="artists/[id]"
          options={{
            title: artistZustandObj?.name || "Artist Detail", // 동적 타이틀 추가
            headerShown: true,
            headerStyle: {
              backgroundColor: currentColors.background,
            },
            headerTintColor: currentColors.foreground,
            headerLeft: () => (
              <Ionicons
                name="chevron-back"
                size={28}
                color={currentColors.foreground}
                style={{ marginLeft: 10 }}
                onPress={() => router.back()}
              />
            ),
          }}
        /> */}
        {/* <Tabs.Screen
          name="tracks"
          options={{
            title: "Tracks",
            headerStyle: {
              backgroundColor: currentColors.background,
            },
            headerTintColor: currentColors.foreground,
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name="musical-notes" color={color} />
            ),
          }}
        /> */}
      </Tabs>
      {/* <Slot /> */}
    </>
  );
}
