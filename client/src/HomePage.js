import React from "react";
import { Link } from "react-router-dom";
import logo from "./assets/dhoon-logo.svg";

function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-700 opacity-20 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-700 opacity-20 blur-[150px] rounded-full"></div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-5 py-10">

        {/* LOGO */}
        <div className="mb-14 text-center">

          <img
            src={logo}
            alt="Dhoon Logo"
            className="w-[220px] md:w-[420px] mx-auto object-contain"
          />

          <p className="text-gray-400 mt-3 text-sm md:text-lg tracking-wide">
            Future of Independent Music Streaming
          </p>

        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">

          {/* ADMIN CARD */}
          <Link to="/admin">

            <div className="group bg-[#0f0f0f]/90 backdrop-blur-xl border border-purple-800/50 rounded-[35px] p-8 md:p-10 hover:scale-[1.03] transition-all duration-500 shadow-[0_0_40px_rgba(168,85,247,0.15)] hover:border-purple-500">

              {/* ICON */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-[28px] bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-4xl md:text-5xl font-bold mb-8 shadow-[0_0_40px_rgba(168,85,247,0.45)] group-hover:rotate-3 transition-all duration-500">
                D
              </div>

              {/* TITLE */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Admin Panel
              </h1>

              {/* DESCRIPTION */}
              <p className="text-gray-400 text-sm md:text-lg leading-relaxed">
                Upload songs, manage music library,
                control streaming and customize Dhoon.
              </p>

              {/* BUTTON */}
              <div className="mt-8">
                <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold shadow-lg hover:opacity-90 transition-all">
                  Open Admin
                </button>
              </div>

            </div>

          </Link>

          {/* USER CARD */}
          <Link to="/music">

            <div className="group bg-[#0f0f0f]/90 backdrop-blur-xl border border-blue-800/50 rounded-[35px] p-8 md:p-10 hover:scale-[1.03] transition-all duration-500 shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:border-blue-500">

              {/* ICON */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-[28px] bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-4xl md:text-5xl mb-8 shadow-[0_0_40px_rgba(59,130,246,0.45)] group-hover:rotate-3 transition-all duration-500">
                ♪
              </div>

              {/* TITLE */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Music Player
              </h1>

              {/* DESCRIPTION */}
              <p className="text-gray-400 text-sm md:text-lg leading-relaxed">
                Stream songs, shuffle playlists,
                discover music and enjoy premium audio.
              </p>

              {/* BUTTON */}
              <div className="mt-8">
                <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold shadow-lg hover:opacity-90 transition-all">
                  Start Listening
                </button>
              </div>

            </div>

          </Link>

        </div>

        {/* FOOTER */}
        <div className="mt-16 text-center text-gray-500 text-xs md:text-sm">

          <p>
            Founder — Mohit (EE, MMMUT GKP)
          </p>

          <p className="mt-1">
            Co-Founder — Rohit • CEO — Anshul
          </p>

        </div>

      </div>

    </div>
  );
}

export default HomePage;