import { useState } from "react";

import Admin from "./Admin";
import Player from "./Player";
import Login from "./Login";

function App() {

  const [page, setPage] = useState("home");

  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("admin") === "true"
  );

  // LOGOUT

  const logout = () => {

    localStorage.removeItem("admin");

    setIsAdmin(false);

    setPage("home");
  };

  // ADMIN PAGE

  if (page === "admin") {

    if (!isAdmin) {
      return <Login setIsAdmin={setIsAdmin} />;
    }

    return (
      <div>

        {/* LOGOUT BUTTON */}

        <button
          onClick={logout}
          className="fixed top-4 right-4 z-50 bg-red-500 text-white px-5 py-2 rounded-xl"
        >
          Logout
        </button>

        <Admin />

      </div>
    );
  }

  // USER PLAYER

  if (page === "player") {
    return <Player />;
  }

  // HOME PAGE

  return (

    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">

        {/* USER */}

        <div
          onClick={() => setPage("player")}
          className="cursor-pointer rounded-3xl border border-purple-900/30 bg-[#111] p-10 hover:scale-105 transition-all"
        >

          <h1 className="text-5xl font-black mb-4">
            🎵 User
          </h1>

          <p className="text-gray-400 text-lg">
            Listen Songs & Stream Music
          </p>

        </div>

        {/* ADMIN */}

        <div
          onClick={() => setPage("admin")}
          className="cursor-pointer rounded-3xl border border-blue-900/30 bg-[#111] p-10 hover:scale-105 transition-all"
        >

          <h1 className="text-5xl font-black mb-4">
            🔐 Admin
          </h1>

          <p className="text-gray-400 text-lg">
            Upload & Manage Songs
          </p>

        </div>

      </div>

    </div>
  );
}

export default App;