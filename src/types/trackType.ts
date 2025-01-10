/*
2025-01-05 20:58:58

      "tracks": [
        {
          "number": "A1",
          "length": 201000,
          "id": "7dfe844d-40f6-4a0a-a587-f98df8ee715f",
          "title": "Any Way You Want It",
          "position": 1,
          "recording": {
            "disambiguation": "",
            "first-release-date": "1980-02-29",
            "id": "e529e98e-9d25-49c7-8c17-e0eb876dc83f",
            "title": "Any Way You Want It",
            "length": 203000,
            "video": false
          }
        },
        {
          "title": "Walks Like a Lady",
          "position": 2,
          "id": "598bed1b-efa9-43fb-a508-69b5808a7fcb",
          "recording": {
            "disambiguation": "",
            "id": "df159eb2-eb16-4b5c-9d78-318397056549",
            "title": "Walks Like a Lady",
            "first-release-date": "1980-02-29",
            "length": 196266,
            "video": false
          },
          "length": 196000,
          "number": "A2"
        },
        {
          "recording": {
            "video": false,
            "length": 212000,
            "id": "8256522a-f3e0-4d76-8f83-cb13ad3fcd50",
            "title": "Someday Soon",
            "first-release-date": "1980-02-29",
            "disambiguation": ""
          },
          "title": "Someday Soon",
          "position": 3,
          "id": "9fdd7a31-83f3-4f5b-9419-69f14454715e",
          "number": "A3",
          "length": 212000
        },

*/

export type TrackType = {
  id: string;
  title: string;
  duration: number;
  position: number;
  disambiguation: string;
  artistId: string;
};

// type TrackRecording = {
//   id: string;
//   title: string;
//   disambiguation: string;
//   "first-release-date": string;
//   video: boolean;
//   length: number;
// };

// type Track = {
//   id: string;
//   title: string;
//   number: string;
//   position: number;
//   recording: TrackRecording;
//   length: number;
// };

// type Media = {
//   "track-offset": number;
//   format: string;
//   title: string;
//   "track-count": number;
//   tracks: Track[];
//   position: number;
//   "format-id": string;
// };

// type TextRepresentation = {
//   language: string;
//   script: string;
// };

// type Area = {
//   type: null;
//   "iso-3166-1-codes": string[];
//   "sort-name": string;
//   disambiguation: string;
//   "type-id": null;
//   name: string;
//   id: string;
// };

// type ReleaseEvent = {
//   area: Area;
//   date: string;
// };

// type CoverArtArchive = {
//   darkened: boolean;
//   back: boolean;
//   artwork: boolean;
//   count: number;
//   front: boolean;
// };

// export type TrackDataType = {
//   quality: string;
//   asin: null;
//   media: Media[];
//   title: string;
//   "text-representation": TextRepresentation;
//   packaging: string;
//   barcode: string;
//   country: string;
//   date: string;
//   status: string;
//   "release-events": ReleaseEvent[];
//   id: string;
//   "status-id": string;
//   "packaging-id": string;
//   disambiguation: string;
//   "cover-art-archive": CoverArtArchive;
// };

export type TrackObjType = {
  id: string;
  title: string;
  number: string;
  position: number;
  length: number;
  recording?: RecordingType;
};
type RecordingType = {
  id: string;
  length: number;
  disambiguation: string;
  "first-release-date": string;
};
