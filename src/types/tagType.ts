import { TrackType } from "./trackType";

export type TagType = {
  id: number;
  name: string;
  count?: number;
};

export type TrackAndTagType = {
  track: TrackType;
  tags: TagType[];
};
