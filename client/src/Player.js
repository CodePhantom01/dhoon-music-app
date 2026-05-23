import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaRandom,
  FaMusic,
  FaSearch,
} from "react-icons/fa";

function Player() {

  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);

  const [shuffle, setShuffle] = useState(false);

  const [duration, setDuration] = useState(0);

  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef();

  // FETCH SONGS

  useEffect(() => {

    axios
      .get("https://dhoon-music-app.onrender.com/api/songs")
      .then((res) => {
        setSongs(res.data);
      });

  }, []);

  // FILTER SONGS

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(search.toLowerCase()) ||
    song.artist.toLowerCase().includes(search.toLowerCase())
  );

  // PLAY SONG

  const playSong = (index) => {

    setCurrentIndex(index);

    setIsPlaying(true);

    setTimeout(() => {
      audioRef.current.play();
    }, 100);
  };

  // PLAY / PAUSE

  const togglePlay = () => {

    if (!audioRef.current) return;

    if (isPlaying) {

      audioRef.current.pause();

    } else {

      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  // NEXT SONG

  const nextSong = () => {

    if (shuffle) {

      const random =
        Math.floor(Math.random() * filteredSongs.length);

      setCurrentIndex(random);

    } else {

      setCurrentIndex((prev) =>
        prev === filteredSongs.length - 1
          ? 0
          : prev + 1
      );
    }

    setIsPlaying(true);
  };

  // PREVIOUS SONG

  const prevSong = () => {

    setCurrentIndex((prev) =>
      prev === 0
        ? filteredSongs.length - 1
        : prev - 1
    );

    setIsPlaying(true);
  };

  // AUTO PLAY

  useEffect(() => {

    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }

 }, [currentIndex, isPlaying]);

  // PLAYER FUNCTIONS

  const handleTimeUpdate = () => {

    setCurrentTime(audioRef.current.currentTime);

    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {

    audioRef.current.currentTime = e.target.value;

    setCurrentTime(e.target.value);
  };

  const formatTime = (time) => {

    if (!time) return "0:00";

    const minutes = Math.floor(time / 60);

    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (

    <div className="bg-[#050505] text-white min-h-screen overflow-x-hidden">

      {/* HEADER */}

      <div className="sticky top-0 z-40 bg-[#090909]/95 backdrop-blur-xl border-b border-purple-900/30">

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">

          {/* TOP */}

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

            {/* LOGO */}

            <div className="flex items-center gap-4">

              <div className="relative">

                <div className="absolute inset-0 bg-purple-600 blur-2xl opacity-40 rounded-full" />

                <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 flex items-center justify-center text-2xl font-black">
                  D
                </div>

              </div>

              <div>

                <h1 className="text-3xl lg:text-4xl font-black">
                  Dhoon
                </h1>

                <p className="text-gray-400 text-xs lg:text-sm mt-1">
                  Future
                </p>

              </div>

            </div>

            {/* FOUNDERS */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full xl:w-auto">

              <div className="bg-[#111] border border-purple-900/30 rounded-xl px-3 py-2">

                <p className="text-[9px] uppercase text-gray-500 mb-1 tracking-widest">
                  Founder
                </p>

                <h3 className="font-bold text-sm text-purple-400">
                  Mohit
                </h3>

                <p className="text-[10px] text-gray-400 mt-1">
                  EE, MMMUT GKP
                </p>

              </div>

              <div className="bg-[#111] border border-blue-900/30 rounded-xl px-3 py-2">

                <p className="text-[9px] uppercase text-gray-500 mb-1 tracking-widest">
                  Co-Founder
                </p>

                <h3 className="font-bold text-sm text-blue-400">
                  Rohit
                </h3>

                <p className="text-[10px] text-gray-400 mt-1">
                  Product & Vision
                </p>

              </div>

              <div className="bg-[#111] border border-pink-900/30 rounded-xl px-3 py-2">

                <p className="text-[9px] uppercase text-gray-500 mb-1 tracking-widest">
                  CEO
                </p>

                <h3 className="font-bold text-sm text-pink-400">
                  Anshul
                </h3>

                <p className="text-[10px] text-gray-400 mt-1">
                  Operations & Growth
                </p>

              </div>

            </div>

          </div>

          {/* SEARCH */}

          <div className="mt-5 relative">

            <FaSearch className="absolute top-4 left-4 text-gray-500 text-sm" />

            <input
              type="text"
              placeholder="Search songs or artists..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full bg-[#111] border border-purple-900/30 rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-purple-500 text-sm"
            />

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5 pb-[230px]">

        {/* HERO */}

        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-purple-700 via-purple-600 to-blue-600 p-5 lg:p-8 mb-7">

          <div className="absolute top-0 right-0 w-52 h-52 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10">

            <p className="uppercase tracking-[4px] text-[10px] lg:text-xs text-white/70 mb-3">
              Dhoon Originals
            </p>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight">
              Experience Music
              <br />
              Beyond Streaming.
            </h2>

          </div>

        </div>

        {/* TITLE */}

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-lg lg:text-2xl font-bold">
            Trending Tracks
          </h2>

          <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-3 py-2 rounded-full text-[10px] lg:text-xs font-bold">
            {filteredSongs.length} Tracks
          </div>

        </div>

        {/* SONG GRID */}

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

          {
            filteredSongs.map((song, index) => (

              <div
                key={song._id}
                onClick={() => playSong(index)}
                className={`group rounded-[24px] overflow-hidden border bg-[#111] cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  currentIndex === index
                    ? "border-purple-500 shadow-2xl shadow-purple-900/20"
                    : "border-[#222]"
                }`}
              >

                {/* IMAGE */}

                <div className="p-3">

                  <div className="h-32 lg:h-40 rounded-[20px] bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 flex items-center justify-center text-5xl lg:text-6xl relative overflow-hidden">

                    <FaMusic />

                  </div>

                </div>

                {/* INFO */}

                <div className="px-4 pb-4">

                  <h3 className="text-sm lg:text-lg font-bold truncate">
                    {song.title}
                  </h3>

                  <p className="text-gray-400 text-xs lg:text-sm mt-1 truncate">
                    {song.artist}
                  </p>

                  <div className="mt-4 flex items-center justify-between">

                    <div className="text-[8px] uppercase tracking-widest text-purple-400">
                      Dhoon Audio
                    </div>

                    <button className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                      <FaPlay className="text-xs" />
                    </button>

                  </div>

                </div>

              </div>
            ))
          }

        </div>

      </div>

      {/* PLAYER */}

      {
        filteredSongs.length > 0 && (

          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/98 backdrop-blur-3xl border-t border-purple-900/30">

            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">

              <div className="flex flex-col gap-4">

                {/* TOP */}

                <div className="flex items-center justify-between gap-3">

                  {/* SONG */}

                  <div className="flex items-center gap-3 min-w-0">

                    <div className="relative">

                      <div className="absolute inset-0 bg-purple-600 blur-xl opacity-40 rounded-full" />

                      <div className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-lg lg:text-xl">
                        <FaMusic />
                      </div>

                    </div>

                    <div className="min-w-0">

                      <h3 className="font-bold text-sm truncate">
                        {filteredSongs[currentIndex]?.title}
                      </h3>

                      <p className="text-gray-400 text-xs truncate">
                        {filteredSongs[currentIndex]?.artist}
                      </p>

                    </div>

                  </div>

                  {/* CONTROLS */}

                  <div className="flex items-center gap-5">

                    <button
                      onClick={() =>
                        setShuffle(!shuffle)
                      }
                      className={`text-lg ${
                        shuffle
                          ? "text-purple-500 scale-110"
                          : "text-white"
                      }`}
                    >
                      <FaRandom />
                    </button>

                    <button
                      onClick={prevSong}
                      className="text-lg"
                    >
                      <FaStepBackward />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="relative"
                    >

                      <div className="absolute inset-0 bg-purple-600 blur-xl opacity-40 rounded-full" />

                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-lg">
                        {
                          isPlaying
                            ? <FaPause />
                            : <FaPlay />
                        }
                      </div>

                    </button>

                    <button
                      onClick={nextSong}
                      className="text-lg"
                    >
                      <FaStepForward />
                    </button>

                  </div>

                </div>

                {/* MODERN SEEK BAR */}

                <div className="w-full bg-[#111] border border-purple-900/30 rounded-2xl p-3">

                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 appearance-none bg-purple-900 rounded-lg cursor-pointer"
                  />

                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2">

                    <span>
                      {formatTime(currentTime)}
                    </span>

                    <span>
                      {formatTime(duration)}
                    </span>

                  </div>

                </div>

                {/* HIDDEN AUDIO */}

                <audio
                  ref={audioRef}
                  src={filteredSongs[currentIndex]?.audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleTimeUpdate}
                  onEnded={nextSong}
                />

              </div>

            </div>

          </div>
        )
      }

    </div>
  );
}

export default Player;