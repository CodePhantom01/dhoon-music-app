import { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";

function PlaylistPicker({
  song,
  playlists,
  onClose,
  onCreatePlaylist,
  onAddToPlaylist,
}) {
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!newName.trim()) {
      return;
    }

    setCreating(true);

    try {
      await onCreatePlaylist(newName.trim(), song);
      onClose();
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#111] border border-purple-900/40 rounded-3xl p-6 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Add to playlist</h3>
            <p className="text-gray-400 text-sm mt-1 truncate">
              {song.title} — {song.artist}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#222] flex items-center justify-center"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleCreate} className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="New playlist name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 bg-black border border-purple-900/40 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 font-semibold text-sm disabled:opacity-50 flex items-center gap-2"
          >
            <FaPlus className="text-xs" />
            Create
          </button>
        </form>

        {playlists.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No playlists yet. Create one above.
          </p>
        ) : (
          <div className="space-y-2">
            {playlists.map((playlist) => {
              const hasSong = playlist.tracks.some(
                (t) => t.id === (song._id || song.id)
              );

              return (
                <button
                  key={playlist.id}
                  onClick={() => onAddToPlaylist(playlist.id, song)}
                  disabled={hasSong}
                  className="w-full text-left p-4 rounded-2xl bg-black border border-[#222] hover:border-purple-500 transition-all disabled:opacity-50"
                >
                  <p className="font-semibold">{playlist.name}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {playlist.tracks.length} songs
                    {hasSong && " · Already added"}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistPicker;
