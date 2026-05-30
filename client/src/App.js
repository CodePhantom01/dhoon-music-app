import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Admin from "./Admin";
import Player from "./Player";
import Login from "./Login";
function AdminRoute() {
  const [isAdmin, setIsAdmin] = useState(
    () => !!localStorage.getItem("adminToken")
  );

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    setIsAdmin(false);
  };

  if (!isAdmin) {
    return <Login setIsAdmin={setIsAdmin} />;
  }

  return (
    <div>
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Player />} />
        <Route path="/music" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
