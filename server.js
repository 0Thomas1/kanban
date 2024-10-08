const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const root = require("path").join(__dirname, "client");
const MongoDB = require("./utils/mongodb.js");

app.use(express.static(root));

MongoDB.connectToMongoDB().then(() => {
  console.log("Connected to MongoDB");
});

app.get("/", (req, res) => {
  res.sendFile("index.html");
});
app.get("/api/boards", (req, res) => {
  MongoDB.getKanbanBoards("thomas").then((boards) => {
    res.send(boards);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
