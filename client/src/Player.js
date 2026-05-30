import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/dhoon-logo.svg";
import { dbPromise } from "./db";
import { api } from "./api";

import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaRandom,
  FaMusic,
  FaSearch,
  FaDownload,
} from "react-icons/fa";

function getSongId(song) {
  return song._id || song.id;
}

function Player() {

  const navigate = useNavigate();
  const audioRef = useRef(null);
  const blobUrlRef = useRef(null);

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
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator !== "undefined" && navigator.onLine
  );
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadedIds, setDownloadedIds] = useState(new Set());

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDownloads = downloadedSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.toLowerCase())
  );

  const activeList = showDownloads ? filteredDownloads : filteredSongs;

  const revokeBlobUrl = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  };

  const loadDownloadedSongs = async () => {
    const db = await dbPromise;
    const allSongs = (await db.getAll("songs")) || [];
    setDownloadedSongs(allSongs);
    setDownloadedIds(new Set(allSongs.map((s) => s.id)));
    return allSongs;
  };

  const getDownloadedSong = async (id) => {
    const db = await dbPromise;
    return db.get("songs", id);
  };

  const fetchSongs = useCallback(async () => {
    try {
      const res = await api.get("/api/songs");
      setSongs(res.data);
      setIsOnline(true);
    } catch (err) {
      console.error(err);
      setIsOnline(false);

      const offline = await loadDownloadedSongs();

      if (offline.length > 0) {
        setShowDownloads(true);
      }
    }
  }, []);

  useEffect(() => {
    fetchSongs();
    loadDownloadedSongs();
  }, [fetchSongs]);

  useEffect(() => {

    const goOnline = () => {
      setIsOnline(true);
      fetchSongs();
    };

    const goOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };

  }, [fetchSongs]);

  useEffect(() => {
    setCurrentIndex(0);
    setShuffle(false);
    setShuffleQueue([]);
    setPlayedSongs([]);
  }, [showDownloads, search]);

  useEffect(() => {
    return () => revokeBlobUrl();
  }, []);

  const downloadSong = async (song) => {
    const id = getSongId(song);

    if (downloadedIds.has(id)) {
      alert(`${song.title} is already saved for offline.`);
      return;
    }

    if (!navigator.onLine) {
      alert("Go online to download songs.");
      return;
    }

    setDownloadingId(id);

    try {
      const res = await api.get(`/api/songs/${id}/audio`, {
        responseType: "blob",
      });

      const db = await dbPromise;

      await db.put(
        "songs",
        {
          id,
          title: song.title,
          artist: song.artist,
          audio: res.data,
          audioUrl: song.audioUrl,
        },
        id
      );

      await loadDownloadedSongs();
      alert(`${song.title} saved for offline listening`);
    } catch (err) {
      console.error(err);
      alert("Download failed. Try again when you have a stable connection.");
    } finally {
      setDownloadingId(null);
    }
  };

  const removeDownload = async (song, e) => {
    e.stopPropagation();

    const id = getSongId(song);
    const db = await dbPromise;
    await db.delete("songs", id);
    await loadDownloadedSongs();
  };

  const playSong = useCallback(
    async (index, options = {}) => {
      const { keepShuffle = false } = options;
      const list = showDownloads ? filteredDownloads : filteredSongs;
      const song = list[index];

      if (!song || !audioRef.current) {
        return;
      }

      if (!keepShuffle) {
        setShuffle(false);
        setShuffleQueue([]);
        setPlayedSongs([]);
      }

      revokeBlobUrl();

      if (showDownloads) {
        blobUrlRef.current = URL.createObjectURL(song.audio);
        audioRef.current.src = blobUrlRef.current;
      } else {
        const offlineSong = await getDownloadedSong(getSongId(song));

        if (offlineSong) {
          blobUrlRef.current = URL.createObjectURL(offlineSong.audio);
          audioRef.current.src = blobUrlRef.current;
        } else if (!navigator.onLine) {
          alert("You are offline. Download this song first or open Downloaded tracks.");
          setIsPlaying(false);
          return;
        } else {
          audioRef.current.src = song.audioUrl;
        }
      }

      setCurrentIndex(index);
      setIsPlaying(true);

      try {
        await audioRef.current.play();
      } catch (err) {
        console.error(err);
        const offlineSong = await getDownloadedSong(getSongId(song));

        if (offlineSong) {
          revokeBlobUrl();
          blobUrlRef.current = URL.createObjectURL(offlineSong.audio);
          audioRef.current.src = blobUrlRef.current;
          await audioRef.current.play();
        }
      }
    },
    [showDownloads, filteredDownloads, filteredSongs]
  );

  const handleAudioError = async () => {
    const song = activeList[currentIndex];

    if (!song || showDownloads) {
      return;
    }

    const offlineSong = await getDownloadedSong(getSongId(song));

    if (offlineSong) {
      revokeBlobUrl();
      blobUrlRef.current = URL.createObjectURL(offlineSong.audio);
      audioRef.current.src = blobUrlRef.current;
      audioRef.current.play().catch(console.error);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const startShuffle = async () => {
    if (!activeList.length) {
      return;
    }

    const indices = activeList.map((_, index) => index);
    const shuffled = [...indices].sort(() => Math.random() - 0.5);

    setShuffle(true);
    setShuffleQueue(shuffled);
    setPlayedSongs([shuffled[0]]);

    await playSong(shuffled[0], { keepShuffle: true });
  };

  const nextSong = async () => {
    if (!activeList.length) {
      return;
    }

    if (shuffle) {
      const remainingSongs = shuffleQueue.filter(
        (index) => !playedSongs.includes(index)
      );

      if (remainingSongs.length === 0) {
        setIsPlaying(false);
        audioRef.current?.pause();
        setShuffle(false);
        return;
      }

      const nextIndex = remainingSongs[0];

      setPlayedSongs((prev) => [...prev, nextIndex]);
      await playSong(nextIndex, { keepShuffle: true });
      return;
    }

    const nextIndex =
      currentIndex >= activeList.length - 1 ? 0 : currentIndex + 1;

    await playSong(nextIndex);
  };

  const prevSong = async () => {
    if (!activeList.length) {
      return;
    }

    const prevIndex =
      currentIndex === 0 ? activeList.length - 1 : currentIndex - 1;

    await playSong(prevIndex, { keepShuffle: shuffle });
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) {
      return;
    }

    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  const formatTime = (time) => {
    if (!time || Number.isNaN(time)) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const currentSong = activeList[currentIndex];

  return (

    <div className="bg-[#050505] text-white min-h-screen overflow-x-hidden">

      {!isOnline && (
        <div className="bg-amber-900/90 text-amber-100 text-center text-sm py-2 px-4">
          Offline mode — playing downloaded songs only.
          {downloadedSongs.length === 0 &&
            " Download tracks while online to listen offline."}
        </div>
      )}

      <div className="sticky top-0 z-40 bg-[#090909]/95 backdrop-blur-xl border-b border-purple-900/30">

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

          <div className="flex items-center gap-4 flex-wrap">

            <img
              src={logo}
              alt="Dhoon Logo"
              className="w-[180px] lg:w-[260px] object-contain"
            />

            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 rounded-xl bg-[#111] border border-purple-900/30 text-white text-sm font-semibold hover:border-purple-500"
            >
              Admin
            </button>

          </div>

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

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-5 pb-[230px]">

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

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-lg lg:text-2xl font-bold">
            {showDownloads ? "Downloaded Tracks" : "Trending Tracks"}
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
            disabled={!activeList.length}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center disabled:opacity-40"
          >
            <FaRandom />
          </button>

          <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-3 py-2 rounded-full text-[10px] lg:text-xs font-bold">
            {activeList.length} Tracks
          </div>

        </div>

        </div>

        <div className="flex flex-col gap-3">

          {activeList.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              {showDownloads
                ? "No downloaded songs yet. Tap the download icon on any track while online."
                : !isOnline
                  ? "You are offline. Open Downloaded or reconnect to load songs."
                  : "No songs found."}
            </p>
          )}

          {activeList.map((song, index) => (

          <div
            key={getSongId(song)}
            onClick={() => playSong(index)}
            className={`flex items-center justify-between p-3 rounded-2xl border bg-[#111] cursor-pointer transition-all ${
              currentIndex === index
                ? "border-purple-500 bg-purple-900/10"
                : "border-[#222]"
            }`}
          >

                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 flex items-center justify-center text-2xl">
                  <FaMusic />
                </div>

                <div className="flex-1 ml-4">

                  <h3 className="text-sm lg:text-lg font-bold truncate">
                    {song.title}
                  </h3>

                  <p className="text-gray-400 text-xs lg:text-sm mt-1 truncate">
                    {song.artist}
                  </p>

                  <div className="flex items-center justify-between mt-2">

                    <div className="text-[8px] uppercase tracking-widest text-purple-400">
                      {downloadedIds.has(getSongId(song))
                        ? "Saved offline"
                        : "Dhoon Audio"}
                    </div>

                    <div className="flex gap-2">

                      {!showDownloads && song.audioUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadSong(song);
                          }}
                          disabled={downloadingId === getSongId(song)}
                          className="w-9 h-9 rounded-full bg-[#222] flex items-center justify-center disabled:opacity-50"
                          title={
                            downloadedIds.has(getSongId(song))
                              ? "Already downloaded"
                              : "Download for offline"
                          }
                        >
                          {downloadingId === getSongId(song) ? (
                            <span className="text-[10px]">...</span>
                          ) : (
                            <FaDownload
                              className={`text-xs ${
                                downloadedIds.has(getSongId(song))
                                  ? "text-green-400"
                                  : ""
                              }`}
                            />
                          )}
                        </button>
                      )}

                      {showDownloads && (
                        <button
                          onClick={(e) => removeDownload(song, e)}
                          className="w-9 h-9 rounded-full bg-red-900/40 border border-red-700 text-[10px] px-1"
                          title="Remove download"
                        >
                          ✕
                        </button>
                      )}

                      <button className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                        <FaPlay className="text-xs" />
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            ))}

        </div>

      </div>

      {activeList.length > 0 && currentSong && (

          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/98 backdrop-blur-3xl border-t border-purple-900/30">

            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">

              <div className="flex flex-col gap-4">

                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-3 min-w-0">

                    <div className="relative">

                      <div className="absolute inset-0 bg-purple-600 blur-xl opacity-40 rounded-full" />

                      <div className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-lg lg:text-xl">
                        <FaMusic />
                      </div>

                    </div>

                    <div className="min-w-0">

                      <h3 className="font-bold text-sm truncate">
                        {currentSong.title}
                      </h3>

                      <p className="text-gray-400 text-xs truncate">
                        {currentSong.artist}
                      </p>

                    </div>

                  </div>

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

                <audio
                  ref={audioRef}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleTimeUpdate}
                  onEnded={nextSong}
                  onError={handleAudioError}
                  onWaiting={() => setLoading(true)}
                  onCanPlay={() => setLoading(false)}
                  onPlaying={() => setLoading(false)}
                />

              </div>

            </div>

          </div>
        )}

    </div>
  );
}

export default Player;
