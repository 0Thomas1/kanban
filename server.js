const express = require("express");
const app = express();
const port = 3000;
const root = require("path").join(__dirname, "client");
const MongoDB = require("./utils/mongodb.js");

//serve the static files
app.use(express.static(root));

//connect to the MongoDB database
MongoDB.connectToMongoDB().then(() => {
  console.log("Connected to MongoDB");
});

//serve the index.html file
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

//get the kanban boards for the user
app.get("/api/boards", (req, res) => {
  MongoDB.getKanbanBoards("thomas").then((boards) => {
    res.send(boards);
  });
});

//start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
