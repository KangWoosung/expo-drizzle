/*
2024-12-31 16:42:26


*/


import { View, Text } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const ArtistLayout = () => {

    return (
    <Stack
    screenOptions={{
      headerShown: true,
      headerTintColor: "white",
      headerStyle: { backgroundColor: "black" },
      headerTitleStyle: { fontWeight: "bold" },
    //   headerBackTitleVisible: false,
    }}
    >
        <Stack.Screen
            name="[id]"
            options={{
            title: "Settings",
            headerLeft: () => (
                <Ionicons
                name="chevron-back"
                size={25}
                color="white"
                onPress={() => router.back()}
                />
            ),
            }}
        />

    </Stack>
    )
}

export default ArtistLayout
