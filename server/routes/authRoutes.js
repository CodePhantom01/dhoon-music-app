const express = require("express");
const { createAdminToken } = require("../middleware/auth");

const router = express.Router();

router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Wrong password" });
  }

  res.json({ token: createAdminToken() });
});

module.exports = router;
