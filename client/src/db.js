import { openDB } from "idb";

export const dbPromise = openDB("dhoon-db", 2, {
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      db.createObjectStore("songs");
    }
    if (oldVersion < 2) {
      db.createObjectStore("playlists");
    }
  },
});
