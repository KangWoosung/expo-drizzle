export type TrackType = {
    id: string;
    title: string;
    duration: number;
    position: number;
    artist: {
        id: string;
        name: string;
    };
    album: {
        id: string;
        title: string;
    };
}