const express = require("express");
const app = express();
const port = 3000;
const root = require("path").join(__dirname, "client");
const MongoDB = require("./utils/mongodb.js");
const userName = "thomas";

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
 app.get("/api/boards", async (req, res) => {
  const user = await User.findOne({ username: userName });
  res.send(user.tasks);
});

//add task to the kanban board
app.post("/api/addTask", (req, res) => {
  const task = req.body;
  console.log(task);
  MongoDB.addTask(task, userName).then((result) => {
    res.send(result);
  });
});

//change the status of the task
app.put("/api/changeTaskStatus", (req, res) => {
  console.log(req.body);
  const taskId = req.body.taskId;
  const newStatus = req.body.newStatus;
  MongoDB.changeTaskStatus(taskId, newStatus, userName).then((result) => {
    console.log(result);
    res.send(result);
  });
});

//delete the task
app.put("/api/deleteTask", (req, res) => {
  console.log(req.body);
  const taskId = req.body.taskId;
  MongoDB.deleteTask(taskId, userName).then((result) => {
    console.log(result);
    res.send(result);
  });
});

//start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

////MONGOOSE TERRITORY
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;
mongoose.connect(uri);

const User = require("./utils/User");
const Task = require("./utils/Task");


