import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {

  const [songs, setSongs] = useState([]);

  useEffect(() => {

    axios.get("/api/songs")
    .then((res) => {
      setSongs(res.data);
    });

  }, []);

  return (
    <div style={{ padding: "20px" }}>

      <h1>My Music App</h1>

      {
        songs.map((song) => (

          <div
            key={song._id}
            style={{
              marginBottom: "20px",
              border: "1px solid gray",
              padding: "10px",
            }}
          >

            <h2>{song.title}</h2>

            <p>{song.artist}</p>

            <audio controls style={{ width: "300px" }}>
              <source
                src={song.audioUrl}
                type="audio/mp3"
              />
            </audio>

          </div>
        ))
      }

    </div>
  );
}

export default Home;