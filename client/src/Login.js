import { useState } from "react";

function Login({ setIsAdmin }) {

  const [password, setPassword] = useState("");

  const handleLogin = () => {

    // CHANGE PASSWORD HERE

    if (password === "dhoonadmin123") {

      localStorage.setItem("admin", "true");

      setIsAdmin(true);

    } else {

      alert("Wrong Password");
    }
  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#111] border border-purple-900/30 rounded-3xl p-8">

        <h1 className="text-4xl font-black text-white mb-2">
          Dhoon Admin
        </h1>

        <p className="text-gray-400 mb-8">
          Secure Dashboard Access
        </p>

        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full bg-black border border-purple-900/30 rounded-2xl px-4 py-4 text-white outline-none focus:border-purple-500"
        />

        <button
          onClick={handleLogin}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-500 py-4 rounded-2xl text-white font-bold text-lg"
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;