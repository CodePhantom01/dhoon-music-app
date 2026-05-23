const express = require("express");
const Song = require("../models/Song");
const upload = require("../middleware/upload");

const router = express.Router();

router.post(
  "/upload",
  upload.single("audio"),
  async (req, res) => {

    try {

      const song = new Song({
        title: req.body.title,
        artist: req.body.artist,
        audioUrl: req.file.path,
      });

      await song.save();

      res.json(song);

    } catch (err) {

      console.log(err);

      res.status(500).json(err);
    }
  }
);

router.get("/", async (req, res) => {

  const songs = await Song.find();

  res.json(songs);
});

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