import { dbPromise } from "./db";

export function createPlaylistId() {
  return `pl-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function trackFromSong(song) {
  return {
    id: song._id || song.id,
    title: song.title,
    artist: song.artist,
    audioUrl: song.audioUrl || null,
  };
}

export async function getAllPlaylists() {
  const db = await dbPromise;
  return (await db.getAll("playlists")) || [];
}

export async function savePlaylist(playlist) {
  const db = await dbPromise;
  await db.put("playlists", playlist, playlist.id);
  return playlist;
}

export async function deletePlaylist(id) {
  const db = await dbPromise;
  await db.delete("playlists", id);
}

export async function createPlaylist(name) {
  const playlist = {
    id: createPlaylistId(),
    name: name.trim(),
    tracks: [],
    createdAt: Date.now(),
  };

  await savePlaylist(playlist);
  return playlist;
}

export async function addTrackToPlaylist(playlistId, track) {
  const db = await dbPromise;
  const playlist = await db.get("playlists", playlistId);

  if (!playlist) {
    throw new Error("Playlist not found");
  }

  if (playlist.tracks.some((t) => t.id === track.id)) {
    return { playlist, added: false };
  }

  playlist.tracks.push(track);
  await savePlaylist(playlist);
  return { playlist, added: true };
}

export async function removeTrackFromPlaylist(playlistId, trackId) {
  const db = await dbPromise;
  const playlist = await db.get("playlists", playlistId);

  if (!playlist) {
    return null;
  }

  playlist.tracks = playlist.tracks.filter((t) => t.id !== trackId);
  await savePlaylist(playlist);
  return playlist;
}

export function resolvePlaylistTracks(playlist, songs, downloadedSongs) {
  if (!playlist) {
    return [];
  }

  return playlist.tracks.map((track) => {
    const fromApi = songs.find((s) => (s._id || s.id) === track.id);

    if (fromApi) {
      return fromApi;
    }

    const fromDownload = downloadedSongs.find((s) => s.id === track.id);

    if (fromDownload) {
      return fromDownload;
    }

    return track;
  });
}
