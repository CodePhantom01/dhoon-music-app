const express = require("express");
const Song = require("../models/Song");
const upload = require("../middleware/upload");

const router = express.Router();


// UPLOAD SONG
router.post(
  "/upload",
  upload.single("audio"),
  async (req, res) => {

    try {

      // CHECK IF SONG TITLE ALREADY EXISTS
      const existingSong = await Song.findOne({
        title: req.body.title
      });

      if (existingSong) {

        return res.status(400).json({
          message: "Song already uploaded"
        });

      }

      // CREATE NEW SONG
      const song = new Song({
        title: req.body.title,
        artist: req.body.artist,
        audioUrl: req.file.path,
      });

      // SAVE SONG
      await song.save();

      // RESPONSE
      res.json(song);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Upload failed"
      });

    }
  }
);


// GET ALL SONGS
router.get("/", async (req, res) => {

  try {

    const songs = await Song.find();

    res.json(songs);

  } catch (err) {

    res.status(500).json(err);

  }
});


// DELETE SONG
router.delete("/:id", async (req, res) => {

  try {

    await Song.findByIdAndDelete(req.params.id);

    res.json({
      message: "Song Deleted"
    });

  } catch (err) {

    res.status(500).json(err);

  }
});


module.exports = router;