import { useArtistsRepository } from '@/db'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useArtistsGetTotal() {
  const artistsRepo = useArtistsRepository()
  const queryClient = useQueryClient()

  const { isPending, error, data } = useQuery({
    queryKey: ['total'],
    queryFn: artistsRepo.totalCnt,
  })

  return { isPending, error, data }
}

export function useArtistsGetRange(start: number, end: number) {
  const artistsRepo = useArtistsRepository()
  const queryClient = useQueryClient()

  const { isPending, error, data } = useQuery({
    queryKey: ['range', start, end],
    queryFn: () => artistsRepo.selectRange(start, end),
  })

  return { isPending, error, data }
}

export function useArtistsGetById(id: number) {
  const artistsRepo = useArtistsRepository()
  const queryClient = useQueryClient()

  const { isPending, error, data } = useQuery({
    queryKey: ['id', id],
    queryFn: () => artistsRepo.selectById(id),
  })

  return { isPending, error, data }
}

export function useAddArtist() {
  const artistsRepo = useArtistsRepository()
  const queryClient = useQueryClient()

  const { isPending, mutate } = useMutation({
    mutationFn: artistsRepo.insert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['total'] })
    },
  })

  return { isAdding: isPending, addArtist: mutate }
}

export function useDeleteArtist() {
  const artistsRepo = useArtistsRepository()
  const queryClient = useQueryClient()

  const { isPending, mutate } = useMutation({
    mutationFn: artistsRepo.deleteById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['total'] })
    },
  })

  return { isDeleting: isPending, deleteArtist: mutate }
}