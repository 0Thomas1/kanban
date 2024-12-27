const express = require("express");
const app = express();
const port = 3000;
const root = require("path").join(__dirname, "client");
const MongoDB = require("./utils/mongodb.js");

//middleware to parse the request body
app.use(express.json());
//serve the static files
app.use(express.static(root));

//connect to the MongoDB database
MongoDB.connectToMongoDB();


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
//add task to the kanban board
app.post('/api/addTask', (req, res) => {

  const task = req.body;
  console.log(task);
  MongoDB.addTask(task, 'thomas').then((result) => {
    res.send(result);
  });
});
//start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
