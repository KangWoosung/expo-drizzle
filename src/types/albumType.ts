
export type AlbumType = {
    id: string;
    title: string;
    artist: string;
    type: string;
    primary_type: string;
    first_release_date: string;
    tags?: { name: string, count: number }[];
  }