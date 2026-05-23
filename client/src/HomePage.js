import React from "react";
import { Link } from "react-router-dom";

function HomePage() {

  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center p-5">

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">

        {/* ADMIN CARD */}

        <Link to="/admin">

          <div className="bg-[#111] border border-purple-800 rounded-3xl p-10 hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-900/30 hover:border-purple-500">

            <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-5xl font-bold mb-8">
              D
            </div>

            <h1 className="text-4xl font-bold mb-4">
              Admin Panel
            </h1>

            <p className="text-gray-400 text-lg">
              Upload songs, manage library,
              delete music and control Dhoon.
            </p>

          </div>

        </Link>

        {/* USER CARD */}

        <Link to="/music">

          <div className="bg-[#111] border border-purple-800 rounded-3xl p-10 hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-900/30 hover:border-purple-500">

            <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-5xl mb-8">
              ♪
            </div>

            <h1 className="text-4xl font-bold mb-4">
              Music Player
            </h1>

            <p className="text-gray-400 text-lg">
              Listen songs, shuffle music,
              play playlists and enjoy Dhoon.
            </p>

          </div>

        </Link>

      </div>

    </div>
  );
}

export default HomePage;