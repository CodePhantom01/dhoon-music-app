const express = require("express");
const Song = require("../models/Song");
const upload = require("../middleware/upload");

const r2 = require("../config/r2");

const { PutObjectCommand } = require("@aws-sdk/client-s3");

const router = express.Router();


// UPLOAD SONG
router.post(
  "/upload",
  upload.single("audio"),
  async (req, res) => {
    try {

      const title = req.body.title.trim();

      // CHECK IF SONG TITLE ALREADY EXISTS
      const existingSong = await Song.findOne({
        title: {
          $regex: new RegExp(`^${title}$`, "i"),
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


// DELETE SONG
router.delete("/:id", async (req, res) => {

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