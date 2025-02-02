/*
2025-01-06 02:34:18

artist.id 와 album.id 를 zustand 컨텍스트로 유지해준다. 
*/

import { InsertAlbumSchemaType } from "@/zod-schemas/albums";
import { InsertArtistSchemaType } from "@/zod-schemas/artists";
import { create } from "zustand";

type ArtistAlbumZustandType = {
  artistZustandId: string;
  artistZustandObj: InsertArtistSchemaType;
  albumZustandId: string;
  albumZustandObj: InsertAlbumSchemaType;
  setArtistZustandId: (artistId: string) => void;
  setArtistZustandObj: (artist: InsertArtistSchemaType) => void;
  setAlbumZustandId: (albumId: string) => void;
  setAlbumZustandObj: (album: InsertAlbumSchemaType) => void;
};

export const useArtistAlbumZustand = create<ArtistAlbumZustandType>((set) => ({
  artistZustandId: "",
  artistZustandObj: {} as InsertArtistSchemaType,
  albumZustandId: "",
  albumZustandObj: {} as InsertAlbumSchemaType,
  setArtistZustandId: (artistId: string) => set({ artistZustandId: artistId }),
  setArtistZustandObj: (artist: InsertArtistSchemaType) =>
    set({ artistZustandObj: artist }),
  setAlbumZustandId: (albumId: string) => set({ albumZustandId: albumId }),
  setAlbumZustandObj: (album: InsertAlbumSchemaType) =>
    set({ albumZustandObj: album }),
}));
