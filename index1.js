const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const port = 8080;

const app = express();
const books = [
  { title: "Harry Potter", id: 1 },
  { title: "Twilight", id: 2 },
  { title: "Lorien Legacies", id: 3 },
];
app.get("/api", (req, res) => {
  res.send([[...books, { title: "karan", id: 4 }], { status: 1 }]);
});

app.listen(port, function () {
  console.log("Server started on port", port);
});
