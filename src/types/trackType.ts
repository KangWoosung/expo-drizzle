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

// export type TrackType = {
//     id: string;
//     title: string;
//     duration: number;
//     position: number;
//     artist: {
//         id: string;
//         name: string;
//     };
//     album: {
//         id: string;
//         title: string;
//     };
// }
