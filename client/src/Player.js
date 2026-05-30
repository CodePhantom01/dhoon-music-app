import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import logo from "./assets/dhoon-logo.svg";
import { dbPromise } from "./db";
import { FaDownload } from "react-icons/fa";

import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaRandom,
  FaMusic,
  FaSearch
} from "react-icons/fa";

function Player({ setPage }) {

  const audioRef = useRef();
  const [songs, setSongs] = useState([]);
  const [downloadedSongs, setDownloadedSongs] = useState([]);
  const [showDownloads, setShowDownloads] = useState(false);
  const [search, setSearch] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);

  const [shuffle, setShuffle] = useState(false);
  const [shuffleQueue, setShuffleQueue] = useState([]);
  const [playedSongs, setPlayedSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [duration, setDuration] = useState(0);

  const [currentTime, setCurrentTime] = useState(0);

  // FETCH SONGS

  useEffect(() => {

    axios
      .get("https://dhoon-music-app.onrender.com/api/songs")
      .then((res) => {
        setSongs(res.data);
      });

  }, []);

  useEffect(() => {
  loadDownloadedSongs();
  }, []);

  // FILTER SONGS

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(search.toLowerCase()) ||
    song.artist.toLowerCase().includes(search.toLowerCase())
  );

  //download Song
    const downloadSong = async (song) => {
    try {
      const response = await fetch(song.audioUrl);

      const blob = await response.blob();

      const db = await dbPromise;

      await db.put(
        "songs",
        {
          id: song._id,
          title: song.title,
          artist: song.artist,
          audio: blob,
        },
        song._id
      );

      await loadDownloadedSongs();

      alert(`${song.title} downloaded successfully`);
    } catch (err) {
      console.log(err);
      alert("Download failed");
    }
  };

  const getDownloadedSong = async (id) => {
    const db = await dbPromise;

    return await db.get("songs", id);
  };

  const loadDownloadedSongs = async () => {
    const db = await dbPromise;

    const allSongs = await db.getAll("songs");

    setDownloadedSongs(allSongs);
  };

  // PLAY SONG

const playSong = async (index) => {

  const list = showDownloads
    ? downloadedSongs
    : filteredSongs;

  const song = list[index];

  if (showDownloads) {

    const localUrl =
      URL.createObjectURL(song.audio);

    audioRef.current.src = localUrl;

  } else {

    const offlineSong =
      await getDownloadedSong(song._id);

    if (offlineSong) {

      const localUrl =
        URL.createObjectURL(
          offlineSong.audio
        );

      audioRef.current.src = localUrl;

    } else {

      audioRef.current.src =
        song.audioUrl;
    }
  }

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

  const startShuffle = () => {

    const indices = filteredSongs.map((_, index) => index);

    const shuffled = [...indices].sort(
      () => Math.random() - 0.5
    );

    setShuffle(true);

    setShuffleQueue(shuffled);

    setPlayedSongs([shuffled[0]]);

    setCurrentIndex(shuffled[0]);

    setIsPlaying(true);
  };

  // NEXT SONG

const nextSong = () => {

  if (shuffle) {

    const remainingSongs =
      shuffleQueue.filter(
        index =>
          !playedSongs.includes(index)
      );

    if (remainingSongs.length === 0) {

      setIsPlaying(false);

      audioRef.current.pause();

      return;
    }

    const nextIndex = remainingSongs[0];

    setPlayedSongs(prev => [
      ...prev,
      nextIndex,
    ]);

    setCurrentIndex(nextIndex);

    setIsPlaying(true);

    return;
  }

  setCurrentIndex(prev =>
    prev === filteredSongs.length - 1
      ? 0
      : prev + 1
  );

  setIsPlaying(true);
};

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

            <img
              src={logo}
              alt="Dhoon Logo"
              className="w-[180px] lg:w-[260px] object-contain"
            />

            <button
              onClick={() => setPage("admin")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-semibold"
            >
              Admin
            </button>

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
                  Vision & Strategy
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

              <div className="bg-[#111] border border-blue-900/30 rounded-xl px-3 py-2">

                <p className="text-[9px] uppercase text-gray-500 mb-1 tracking-widest">
                  Team
                </p>

                <h3 className="font-bold text-sm text-blue-400">
                  Uploaders
                </h3>

                <p className="text-[10px] text-gray-400 mt-1">
                  Pushpendra, Mohit, Anshul, Rohit
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

        <div className="flex items-center gap-3">

          <button
            onClick={() =>
              setShowDownloads(!showDownloads)
            }
            className="px-3 py-2 rounded-full bg-[#111] border border-purple-700 text-xs"
          >
            {showDownloads
              ? "All Songs"
              : "Downloaded"}
          </button>

          <button
            onClick={startShuffle}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center"
          >
            <FaRandom />
          </button>

          <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-3 py-2 rounded-full text-[10px] lg:text-xs font-bold">
            {filteredSongs.length} Tracks
          </div>

        </div>

        </div>

        {/* SONG GRID */}

        <div className="flex flex-col gap-3">

          {
            (showDownloads
              ? downloadedSongs
              : filteredSongs
            ).map((song, index) => (

          <div
            key={song._id}
            onClick={() => playSong(index)}
            className={`flex items-center justify-between p-3 rounded-2xl border bg-[#111] cursor-pointer transition-all ${
              currentIndex === index
                ? "border-purple-500 bg-purple-900/10"
                : "border-[#222]"
            }`}
          >

                {/* IMAGE */}

                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 flex items-center justify-center text-2xl">
                  <FaMusic />
                </div>

                {/* INFO */}

                <div className="flex-1 ml-4">

                  <h3 className="text-sm lg:text-lg font-bold truncate">
                    {song.title}
                  </h3>

                  <p className="text-gray-400 text-xs lg:text-sm mt-1 truncate">
                    {song.artist}
                  </p>

                  <div className="flex items-center justify-between mt-2">

                    <div className="text-[8px] uppercase tracking-widest text-purple-400">
                      Dhoon Audio
                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadSong(song);
                        }}
                        className="w-9 h-9 rounded-full bg-[#222] flex items-center justify-center"
                      >
                        <FaDownload className="text-xs" />
                      </button>

                      <button className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                        <FaPlay className="text-xs" />
                      </button>

                    </div>

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
                        {(
                          showDownloads
                            ? downloadedSongs
                            : filteredSongs
                        )[currentIndex]?.title}
                      </h3>

                      <p className="text-gray-400 text-xs truncate">
                        {(
                          showDownloads
                            ? downloadedSongs
                            : filteredSongs
                        )[currentIndex]?.artist}
                      </p>

                    </div>

                  </div>

                  {/* CONTROLS */}

                  <div className="flex items-center gap-5">

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
                          loading ? (
                            <div className="flex items-end gap-[2px]">
                              <span className="wave"></span>
                              <span className="wave"></span>
                              <span className="wave"></span>
                              <span className="wave"></span>
                            </div>
                          ) : (
                            isPlaying
                              ? <FaPause />
                              : <FaPlay />
                          )
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

                {/* MUSIC WAVEFORM */}

                {isPlaying && (
                  <div className="flex justify-center items-end gap-[3px] h-20 overflow-hidden px-2">

                    {[...Array(70)].map((_, i) => (
                      <span
                        key={i}
                        className="music-bar"
                        style={{
                          height: `${10 + ((i * 17) % 55)}px`,
                          animationDelay: `${i * 0.05}s`,
                        }}
                      />
                    ))}

                  </div>
                )}

                {/* MODERN SEEK BAR */}

                <div className="w-full bg-[#111] border border-purple-900/30 rounded-2xl p-3">

                  {loading ? (

                    <div className="flex justify-center items-end gap-1 h-10">

                      <span className="wave"></span>
                      <span className="wave"></span>
                      <span className="wave"></span>
                      <span className="wave"></span>
                      <span className="wave"></span>
                      <span className="wave"></span>
                      <span className="wave"></span>

                    </div>

                  ) : (

                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 appearance-none bg-purple-900 rounded-lg cursor-pointer"
                    />

                  )}

                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2">

                    <span>{formatTime(currentTime)}</span>

                    <span>{formatTime(duration)}</span>

                  </div>

                </div>

                {/* HIDDEN AUDIO */}

                <audio
                  ref={audioRef}
                  src={filteredSongs[currentIndex]?.audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleTimeUpdate}
                  onEnded={nextSong}
                  onWaiting={() => setLoading(true)}
                  onCanPlay={() => setLoading(false)}
                  onPlaying={() => setLoading(false)}
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