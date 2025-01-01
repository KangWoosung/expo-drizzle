/*
2024-12-31 02:36:25

Dynamic Route:
/src/app/(tabs)/artists/detail/[id].tsx

  const { id } = useLocalSearchParams();


*/

import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { Card } from '@/components/ui/card';
import { useSQLiteContext } from 'expo-sqlite';
import { useQuery } from '@tanstack/react-query';

const ArtistDetail = () => {
  const { id: artistId } = useLocalSearchParams();
  
  const [shouldFetchAlbums, setShouldFetchAlbums] = useState(false)
  const db = useSQLiteContext()

  const { data, isLoading, error } = useQuery({
    queryKey: ['searchAlbum', artistId],
    queryFn: async () => {      
      const response = await fetch(
        `https://musicbrainz.org/ws/2/release?artist=${artistId}&fmt=json`,
        {
          headers: {
            'User-Agent': 'Hoerzu/1.0.0 ( http://hoerzu.example.com )',
            'From': 'Hoerzu/1.0.0 ( me@hoerzu.com )'
          }
        }
      )
      return response.json()
    },
    enabled: shouldFetchAlbums, // 이 옵션을 추가
  });

  
  const insertAlbumsToDB = async (albums: any[]) => {
    
    try {
      await db.withTransactionAsync(async () => {
        // releases 테이블에 앨범 정보 삽입
        const statement = await db.prepareAsync(
          `INSERT OR IGNORE INTO releases (
            id, 
            title, 
            status, 
            release_date, 
            country, 
            disambiguation, 
            artist_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`
        );
        for (const album of albums) {
          await statement.executeAsync(
            [
              album.id,
              album.title,
              album.status,
              album['release-date'],
              album.country,
              album.disambiguation,
              artistId
            ]
          );
        }
        await statement.finalizeAsync();
      });
      console.log('Albums successfully inserted into DB');
    } catch (error) {
      console.error('Error inserting albums:', error);
    }
  };

  useEffect(() => {
    if (data?.releases && data.releases.length > 0) {
      insertAlbumsToDB(data.releases);
    }
    console.log('받아온 data:', data)
  }, [data, isLoading])

  const retrieveAlbums = async () => {
    setShouldFetchAlbums(true)
  }

  if (isLoading) return (
    <Card className="w-full max-w-md mx-auto my-4 h-24">
      <Text>Retrieving Albums Data... Plz wait...</Text>
    </Card>
  );

  return (
    <View>
      <Text>ArtistDetail</Text>
      <Text>id: {artistId}</Text>
    </View>
  )
}

export default ArtistDetail