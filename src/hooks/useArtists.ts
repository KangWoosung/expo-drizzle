import { useArtistsRepository } from "@/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";

export function useArtistsGetTotal() {
  const db = useSQLiteContext();
  const artistsRepo = useArtistsRepository(db);
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: ["total"],
    queryFn: artistsRepo.totalCnt,
    staleTime: 0,
    // cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return { isPending, error, data };
}

export function useArtistsGetRange(start: number, end: number) {
  const db = useSQLiteContext();
  const artistsRepo = useArtistsRepository(db);
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: ["range", start, end],
    queryFn: () => artistsRepo.selectRange(start, end),
  });

  return { isPending, error, data };
}

export function useArtistsGetById(id: number) {
  const db = useSQLiteContext();
  const artistsRepo = useArtistsRepository(db);
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: ["id", id],
    queryFn: () => artistsRepo.selectById(id),
  });

  return { isPending, error, data };
}

export function useAddArtist() {
  const db = useSQLiteContext();
  const artistsRepo = useArtistsRepository(db);
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: artistsRepo.insert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["total"] });
    },
  });

  return { isAdding: isPending, addArtist: mutate };
}

export function useDeleteArtist() {
  const db = useSQLiteContext();
  const artistsRepo = useArtistsRepository(db);
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: artistsRepo.deleteById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["total"] });
    },
  });

  return { isDeleting: isPending, deleteArtist: mutate };
}
