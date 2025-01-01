import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useArtistsGetTotal } from '@/hooks'
import { useArtistsRepository } from '@/db'

const index = () => {
  const { isPending:artistsPending, error:artistsError, data:artistsCnt } = useArtistsGetTotal()
  // const { isPending:tracksPending, error:tracksError, data:tracksCnt } = useTracksGetTotal()

  return (
    <View className='flex-1 justify-center align-middle mt-40'>
      {
      artistsError ? 
        <Text>Error: {artistsError.message}</Text>
        :
        artistsPending ? 
          <Text>Loading...</Text>
          :
          <View className='flex flex-row  '>
            <Text className='p-8 text-4xl '>
              {artistsCnt} 
            </Text>
            <Text className='p-8 text-2xl'>favorite artists</Text>
          </View>
      }
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