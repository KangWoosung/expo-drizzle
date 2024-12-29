import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { getColors } from '@/constants/color';
import { useColorScheme } from 'nativewind';
import { ArtistType } from '@/types/atristType';

type ArtistProps = {
  artist: ArtistType;
  handleSave: (artist: any) => void;
}

const ArtistCard = ({ artist, handleSave }: ArtistProps) => {
  const { colorScheme } = useColorScheme();
  const currentColors = getColors(colorScheme as "light" | "dark");

  return (
    <View className='p-4'>
    <Text className="text-2xl p-3 text-gray-800 font-bold">{artist.name}</Text>
    <View key={artist.id} className="flex flex-row mx-4 mb-4 p-3 bg-gray-800 rounded-lg">
      <View className="w-80 " >        
        <Text className="text-lg text-gray-200">국가: {artist.country || '정보없음'}</Text>
        <Text className="text-lg text-gray-200">점수: {artist.type} </Text>
        <Text className="text-base text-gray-200">설명: {artist.disambiguation || '정보없음'}</Text>
      </View>
      <View className="flex flex-row gap-2">
         <Text className="w-14 h-14 rounded-full align-middle text-center bg-indigo-600 text-gray-100 text-xl font-bold">
          {artist.score}
        </Text>
        <Pressable 
          className="w-14 h-14 rounded-full align-middle text-center bg-teal-700 text-gray-100"
          onPress={() => handleSave(artist)}
        >
          <Ionicons size={28} name="document-text" color={currentColors.background} />
        </Pressable>
      </View>
    </View>
    </View>
  )
}

export default ArtistCard