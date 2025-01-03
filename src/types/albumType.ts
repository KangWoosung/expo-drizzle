export type AlbumType = {
  id: string;
  title: string;
  status: string;
  country: string;
  date: string;
  packaging: string;
  disambiguation?: string;
  asin?: string;
  quality?: string;
  barcode?: string;
  packagingId?: string;
  statusId?: string;
  artistId?: string;
};

export type ReleasesType = {
  releases: AlbumType[];
};
