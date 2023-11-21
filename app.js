// src/app.js
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./src/routes/index");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (error) =>
  console.error("MongoDB Connection Error:", error)
);
mongoose.connection.once("open", () => console.log("Connected to MongoDB"));

app.use("/api", userRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
