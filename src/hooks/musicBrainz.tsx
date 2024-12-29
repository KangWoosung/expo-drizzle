import { View, Text } from 'react-native'
import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type MusicBrainzQueryType = {
    query: string
}

export const queryMusicBrainz = async ({query}: MusicBrainzQueryType) => {
    return await fetch(`https://musicbrainz.org/ws/2/artist?query=${query}&fmt=json`)
    .then((res) => res.json())
}


export function useQueryMusicBrainz({query}: MusicBrainzQueryType) {
    const queryClient = useQueryClient()

    const { data, isPending, error } = useQuery({
        queryKey: ['musicBrainz', query],
        queryFn: () => queryMusicBrainz({ query }),
    })

    return { data, isPending, error }
}
  