import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

const MigrationFallback = () => {
  return (
    <View className="flex-1 bg-gray-100 justify-center items-center">
      <View className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-md">
        <Text className="text-lg font-bold text-gray-800 text-center mb-4">
          데이터베이스 업데이트 중...
        </Text>
        <Text className="text-sm text-gray-600 text-center mb-6">
          최신 데이터를 준비하고 있습니다. 잠시만 기다려 주세요. 🚀
        </Text>
        <View className="flex justify-center items-center">
          <ActivityIndicator size="large" color="#4B5563" />
        </View>
      </View>
    </View>
  )
}

export default MigrationFallback