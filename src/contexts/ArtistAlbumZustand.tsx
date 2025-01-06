/*
2025-01-06 02:34:18

artist.id 와 album.id 를 zustand 컨텍스트로 유지해준다. 
*/

import { create } from "zustand";
import { ArtistType } from "@/types";
import { AlbumType } from "@/types";
import { TrackType } from "@/types/trackType";
import { TagType } from "@/types/tagType";

type ArtistAlbumZustandType = {
  artistZustandId: string;
  artistZustandObj: ArtistType;
  albumZustandId: string;
  albumZustandObj: AlbumType;
  setArtistZustandId: (artistId: string) => void;
  setArtistZustandObj: (artist: ArtistType) => void;
  setAlbumZustandId: (albumId: string) => void;
  setAlbumZustandObj: (album: AlbumType) => void;
};

export const useArtistAlbumZustand = create<ArtistAlbumZustandType>((set) => ({
  artistZustandId: "",
  artistZustandObj: {} as ArtistType,
  albumZustandId: "",
  albumZustandObj: {} as AlbumType,
  setArtistZustandId: (artistId: string) => set({ artistZustandId: artistId }),
  setArtistZustandObj: (artist: ArtistType) =>
    set({ artistZustandObj: artist }),
  setAlbumZustandId: (albumId: string) => set({ albumZustandId: albumId }),
  setAlbumZustandObj: (album: AlbumType) => set({ albumZustandObj: album }),
}));
