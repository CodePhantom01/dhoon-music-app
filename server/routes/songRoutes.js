const express = require("express");
const Song = require("../models/Song");
const upload = require("../middleware/upload");
const { requireAdmin } = require("../middleware/auth");

const r2 = require("../config/r2");

const { PutObjectCommand } = require("@aws-sdk/client-s3");

const router = express.Router();

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// UPLOAD SONG
router.post(
  "/upload",
  requireAdmin,
  upload.single("audio"),
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          message: "Audio file is required",
        });
      }

      const title = req.body.title.trim();

      // CHECK IF SONG TITLE ALREADY EXISTS
      const existingSong = await Song.findOne({
        title: {
          $regex: new RegExp(`^${escapeRegex(title)}$`, "i"),
        },
      });

      if (existingSong) {
        return res.status(400).json({
          message: "Song already uploaded",
        });
      }

      const fileName =
        Date.now() + "-" + req.file.originalname;

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: fileName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
      );

      const audioUrl =
        `${process.env.R2_PUBLIC_URL}/${fileName}`;

      // CREATE NEW SONG
      const song = new Song({
        title,
        artist: req.body.artist,
        audioUrl,
      });

      // SAVE SONG
      await song.save();

      // RESPONSE
      res.json(song);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Upload failed",
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


// STREAM AUDIO (for downloads — avoids browser CORS on R2)
router.get("/:id/audio", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const audioResponse = await fetch(song.audioUrl);

    if (!audioResponse.ok) {
      return res.status(502).json({ message: "Failed to fetch audio" });
    }

    const buffer = Buffer.from(await audioResponse.arrayBuffer());
    const contentType =
      audioResponse.headers.get("content-type") || "audio/mpeg";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(buffer);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to load audio" });
  }
});

// DELETE SONG
router.delete("/:id", requireAdmin, async (req, res) => {

  try {

    await Song.findByIdAndDelete(req.params.id);

    res.json({
      message: "Song Deleted",
    });

  } catch (err) {

    res.status(500).json(err);

  }
});

module.exports = router;