const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: {
    folder: "songs",
    resource_type: "video",
  },
});

const upload = multer({ storage });

module.exports = upload;