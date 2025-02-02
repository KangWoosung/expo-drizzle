/*
2025-01-29 21:31:39

drizzle 버전으로 수정하였다. 
그런데 이 모듈이 사용되지는 않는 것 같은데..

*/

// import { useArtistsRepository } from "@/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from "@/db/drizzle/schema";
import { count, eq } from "drizzle-orm";
import { InsertArtistSchemaType } from "@/zod-schemas/artists";

export function useArtistsGetTotal() {
  const db = useSQLiteContext();
  const drizzleDB = drizzle(db);
  // const artistsRepo = useArtistsRepository(db);

  const { isPending, error, data } = useQuery({
    queryKey: ["total"],
    queryFn: async () => {
      const result = await drizzleDB
        .select({ count: count() })
        .from(schema.artists);
      return result;
    },
    staleTime: 0,
    // cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return { isPending, error, data };
}

export function useArtistsGetRange(start: number, end: number) {
  const db = useSQLiteContext();
  const drizzleDB = drizzle(db);

  const { isPending, error, data } = useQuery({
    queryKey: ["range", start, end],
    queryFn: async () => {
      const result = await drizzleDB
        .select()
        .from(schema.artists)
        .offset(start)
        .limit(end);
      return result;
    },
  });

  return { isPending, error, data };
}

export function useArtistsGetById(id: string) {
  const db = useSQLiteContext();
  // const artistsRepo = useArtistsRepository(db);
  const drizzleDB = drizzle(db);

  const { isPending, error, data } = useQuery({
    queryKey: ["id", id],
    queryFn: async () => {
      const result = await drizzleDB
        .select()
        .from(schema.artists)
        .where(eq(schema.artists.id, id));
      return result;
    },
  });

  return { isPending, error, data };
}

export function useAddArtist() {
  const db = useSQLiteContext();
  const drizzleDB = drizzle(db);
  // const artistsRepo = useArtistsRepository(db);
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: (artist: {
      id: string;
      name: string;
      country: string;
      type: string;
      disambiguation: string;
      "life-span"?: {
        begin?: string;
        end?: string;
      };
    }) =>
      drizzleDB.insert(schema.artists).values(artist as InsertArtistSchemaType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["total"] });
    },
  });

  return { isAdding: isPending, addArtist: mutate };
}

export function useDeleteArtist() {
  const db = useSQLiteContext();
  const drizzleDB = drizzle(db);
  // const artistsRepo = useArtistsRepository(db);
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: (artistId: string) =>
      drizzleDB.delete(schema.artists).where(eq(schema.artists.id, artistId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["total"] });
    },
  });

  return { isDeleting: isPending, deleteArtist: mutate };
}
