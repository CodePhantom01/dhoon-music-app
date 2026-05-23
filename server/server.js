const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const songRoutes = require("./routes/songRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.use("/api/songs", songRoutes);

app.listen(5000, () => {
  console.log("Server Running");
});