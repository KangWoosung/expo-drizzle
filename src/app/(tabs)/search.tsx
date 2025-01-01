import { FlatList, Keyboard, Text, View } from 'react-native'

import { Header } from '@/components/header'

import ApiArtistCard from '../_components/apiresult/ApiArtistCard'
import SearchForm from '../_components/apiform/SearchForm'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/useDebounce'
import { useArtistsRepository } from '../../db'
import { useTagsRepository } from '../../db'
import { useSQLiteContext } from 'expo-sqlite'
import { toast } from '@/utils/toast'

interface TagResult {
  id: number;
  name: string;
}

export default function SearchPage() {
  const [searchStr, setSearchStr] = useState('')
  const debouncedSearchStr = useDebounce(searchStr, 500)
  const searchInputRef = useRef(null)
  const artistsRepo = useArtistsRepository()
  const tagsRepo = useTagsRepository()
  
  const db = useSQLiteContext()

  useEffect(() => {
    // searchInputRef.current?.focus()

    return () => {
      Keyboard.dismiss()
      db.closeAsync() // 컴포넌트 언마운트 시 명시적으로 닫기
    }
  }, [])

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', debouncedSearchStr],
    queryFn: async () => {
      if (!debouncedSearchStr.trim()) return { artists: [] };
      
      const response = await fetch(
        `https://musicbrainz.org/ws/2/artist?query=${encodeURIComponent(debouncedSearchStr)}&fmt=json`,
        {
          headers: {
            'User-Agent': 'Hoerzu/1.0.0 ( http://hoerzu.example.com )',
            'From': 'Hoerzu/1.0.0 ( me@hoerzu.com )'
          }
        }
      )
      return response.json()
    },
    // 2글자 이상일 때만 queryFn enabled
    enabled: debouncedSearchStr.trim().length >= 2
  })

  const handleSearch = (text: string) => {
    setSearchStr(text);
  };

  async function handleSave(artist: any) {

    try {
      await db.withTransactionAsync(async () => {
        console.log('trying to save artist:', artist.name)
        // 1. 아티스트 저장
        await artistsRepo.insert({
          id: artist.id,
          name: artist.name,
          type: artist.type,
          country: artist.country,
          disambiguation: artist.disambiguation,
          begin_date: artist['life-span']?.begin,
          end_date: artist['life-span']?.end
        })
        console.log('artist:', artist)
        
        toast.show('Artist saved: ' + artist.name);

        // 2. 릴리스 그룹이 있다면 저장
        // if (artist['release-groups']) {
        //   for (const rg of artist['release-groups']) {
        //     await releaseGroupsRepo.insert({
        //       id: rg.id,
        //       name: rg.title,
        //       artist_id: artist.id,
        //       type: rg.type,
        //       primary_type: rg['primary-type'],
        //       first_release_date: rg['first-release-date']
        //     })

        //     // 3. 태그가 있다면 저장
        //     if (rg.tags) {
        //       for (const tag of rg.tags) {
        //         let tagResult = await tagsRepo.selectByName(tag.name)
        //         let tagId: number

        //         if (!tagResult) {
        //           await tagsRepo.insert(tag.name)
        //           tagResult = await tagsRepo.selectByName(tag.name)
        //         }
        //         tagId = (tagResult as TagResult).id

        //         await releaseGroupTagsRepo.insert(
        //           rg.id,
        //           tagId,
        //           tag.count
        //         )
        //       }
        //     }
        //   }
        // }
      })
      // await db.closeAsync(); // 트랜잭션 완료 후 명시적으로 닫기
    } catch (error) {
      console.error('Error saving artist:', error)
      throw error
    } finally {
      console.log('Artist saved:', artist.name)
    }
  }

  return (
    <View className="flex-1">
      <Header
        title="헬로월드 뮤직"
        subtitle="My music database"
      />

      <SearchForm ref={searchInputRef} onSearch={handleSearch} />

      {isLoading && <Text className="p-4">검색중...</Text>}
      {error && <Text className="p-4">에러가 발생했습니다</Text>}
      
      <FlatList
        data={data?.artists || []}
        renderItem={({ item }) => <ApiArtistCard artist={item} handleSave={handleSave} />}
      />
    </View>
  )
}
