import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useArtistsGetTotal } from '@/hooks'

const index = () => {
  const { isPending, error, data:artistsCnt } = useArtistsGetTotal()

  useEffect(() => {
    console.log('Home')
  }, [])

  return (
    <View className='flex-1 justify-center align-middle mt-40'>
      <View className='flex flex-row  '>
        <Text className='p-8 text-4xl '>
          {artistsCnt} 
        </Text>
        <Text className='p-8 text-2xl'>favorite artists</Text>
      </View>
      <Text className='p-8'>
        <Text className='p-8 text-4xl '>
          {0/0} 
        </Text>
        <Text className='p-8 text-2xl'>of favorite albums are playable</Text>
         
      </Text>
      <Text className='p-8'>
        <Text className='p-8 text-4xl '>
          {0} 
        </Text>
        <Text className='p-8 text-2xl'>unsortable tracks</Text>
      </Text>
    </View>
  )
}

export default index