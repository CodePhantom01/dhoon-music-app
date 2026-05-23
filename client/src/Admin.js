import React, { useEffect, useState } from "react";
import axios from "axios";

function Admin() {

  const [songs, setSongs] = useState([]);

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audio, setAudio] = useState(null);

  const [loading, setLoading] = useState(false);

  // FETCH SONGS

  const fetchSongs = async () => {

    try {

      const res = await axios.get(
        "https://dhoon-music-app.onrender.com/api/songs"
      );

      setSongs(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  useEffect(() => {

    fetchSongs();

  }, []);

  // UPLOAD SONG

  const uploadSong = async (e) => {

    e.preventDefault();

    if (!audio) {

      alert("Please select audio file");

      return;

    }

    setLoading(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("audio", audio);

    try {

      await axios.post(
        "https://dhoon-music-app.onrender.com/api/songs/upload",
        formData
      );

      alert("Song Uploaded");

      setTitle("");
      setArtist("");
      setAudio(null);

      fetchSongs();

    } catch (err) {

      console.log(err);

      if (err.response?.data?.message) {

        alert(err.response.data.message);

      } else {

        alert("Upload Failed");

      }

    } finally {

      setLoading(false);

    }
  };

  // DELETE SONG

  const deleteSong = async (id) => {

    try {

      await axios.delete(
        `https://dhoon-music-app.onrender.com/api/songs/${id}`
      );

      fetchSongs();

    } catch (err) {

      console.log(err);

    }
  };

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* HEADER */}

      <div className="border-b border-purple-800 px-4 lg:px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-3 lg:gap-4">

          {/* LOGO */}

          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-2xl lg:text-3xl font-bold shadow-lg shadow-purple-500/50">
            D
          </div>

          <div>

            <h1 className="text-2xl lg:text-4xl font-bold">
              Dhoon Admin
            </h1>

            <p className="text-gray-400 text-xs lg:text-sm">
              Music Streaming Dashboard
            </p>

          </div>

        </div>

      </div>

      {/* MAIN */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-4 lg:p-5 h-auto lg:h-[calc(100vh-90px)]">

        {/* LEFT PANEL */}

        <div className="bg-[#111] rounded-3xl border border-purple-900 p-5 shadow-2xl shadow-purple-900/30 h-fit">

          <h2 className="text-2xl font-bold mb-5">
            Upload Song
          </h2>

          <form
            onSubmit={uploadSong}
            className="space-y-4"
          >

            <input
              type="text"
              placeholder="Song Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full p-3 rounded-2xl bg-black border border-purple-700 outline-none focus:border-purple-400 text-sm"
              required
            />

            <input
              type="text"
              placeholder="Artist Name"
              value={artist}
              onChange={(e) =>
                setArtist(e.target.value)
              }
              className="w-full p-3 rounded-2xl bg-black border border-purple-700 outline-none focus:border-purple-400 text-sm"
              required
            />

            <input
              type="file"
              accept=".mp3"
              onChange={(e) =>
                setAudio(e.target.files[0])
              }
              className="w-full p-3 rounded-2xl bg-black border border-purple-700 text-sm"
              required
            />

            <button
              disabled={loading}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-lg font-bold hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-purple-600/40 disabled:opacity-50"
            >

              {
                loading
                  ? "Uploading..."
                  : "Upload Song"
              }

            </button>

          </form>

        </div>

        {/* RIGHT PANEL */}

        <div className="lg:col-span-2 bg-[#111] rounded-3xl border border-purple-900 p-4 lg:p-5 overflow-hidden">

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-2xl font-bold">
              Uploaded Songs
            </h2>

            <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 rounded-full font-bold text-sm">
              {songs.length} Songs
            </div>

          </div>

          {/* SONG LIST */}

          <div className="space-y-4 lg:h-[78vh] overflow-y-auto pr-1 lg:pr-2 pb-28">

            {
              songs.map((song) => (

                <div
                  key={song._id}
                  className="bg-black border border-purple-800 rounded-2xl p-4 hover:border-purple-500 transition-all"
                >

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div className="flex-1 min-w-0">

                      <h3 className="text-lg font-bold truncate">
                        {song.title}
                      </h3>

                      <p className="text-gray-400 text-sm truncate">
                        {song.artist}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        deleteSong(song._id)
                      }
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm font-bold w-full sm:w-auto"
                    >
                      Delete
                    </button>

                  </div>

                  <audio
                    controls
                    className="w-full mt-4 h-10"
                  >
                    <source
                      src={song.audioUrl}
                      type="audio/mp3"
                    />
                  </audio>

                </div>
              ))
            }

          </div>

        </div>

      </div>

    </div>
  );
}

export default Admin;