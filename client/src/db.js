import { openDB } from "idb";

export const dbPromise = openDB("dhoon-db", 1, {
  upgrade(db) {
    db.createObjectStore("songs");
  },
});