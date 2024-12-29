import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useArtistsRepository } from '@/db'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'


const artists = () => {
  const artistsRepo = useArtistsRepository()
  const { data } = useQuery({
    queryKey: ['artists', 'total'],
    queryFn: () => artistsRepo.totalCnt()
  })

  return (
    <View>
      <Text>artists</Text>
      <Text>{data}</Text>
    </View>
  )
}

export default artists