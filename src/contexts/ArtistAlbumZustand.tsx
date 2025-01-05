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
  artistId: string;
  artistObj: ArtistType;
  albumId: string;
  albumObj: AlbumType;
  setArtistId: (artistId: string) => void;
  setArtistObj: (artist: ArtistType) => void;
  setAlbumId: (albumId: string) => void;
  setAlbumObj: (album: AlbumType) => void;
};

export const useArtistAlbumZustand = create<ArtistAlbumZustandType>((set) => ({
  artistId: "",
  artistObj: {} as ArtistType,
  albumId: "",
  albumObj: {} as AlbumType,
  setArtistId: (artistId: string) => set({ artistId }),
  setArtistObj: (artist: ArtistType) => set({ artistObj: artist }),
  setAlbumId: (albumId: string) => set({ albumId }),
  setAlbumObj: (album: AlbumType) => set({ albumObj: album }),
}));
