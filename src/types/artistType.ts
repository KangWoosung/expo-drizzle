

export type ArtistType = {
    id: string;
    name: string;
    sort_name?: string;
    country?: string;
    type?: string;
    disambiguation?: string;
    begin_date?: string;
    end_date?: string;
    score?: number; // 새로운 score 필드
    albumsCnt?: number; // 새로운 albumsCnt 필드
}