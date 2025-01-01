import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
// import { BlurView } from "expo-blur";
import { Slot, Tabs } from "expo-router";
import { iconSize } from "@/constants/tokens";
import { Platform, StyleSheet, View } from "react-native";

import { useColorScheme } from "nativewind";
import { getColors } from "@/constants/color";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const currentColors = getColors(colorScheme as "light" | "dark");

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
          headerBackground: () => (
            <View
              style={StyleSheet.absoluteFill}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerTitle: "Home Screen",
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <Ionicons size={iconSize.sm} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search Musicians",
            headerShown: false,
            headerStyle: {
              backgroundColor: currentColors.background,
            },
            headerTintColor: currentColors.foreground,
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name="document-text" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="artists/index"
          options={{
            title: "Artists",
            headerStyle: {
              backgroundColor: currentColors.background,
            },
            headerTintColor: currentColors.foreground,
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name="musical-notes" color={color} />
            ),
          }}
        />
        <Tabs.Screen
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
        />
      </Tabs>
      {/* <Slot /> */}
    </>
  );
}
