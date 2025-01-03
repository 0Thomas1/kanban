const express = require("express");
const app = express();
const port = 3000;
const root = require("path").join(__dirname, "client");
const MongoDB = require("./utils/mongodb.js");
const userName = "thomas";
const User = require("./utils/User.js");
const Task = require("./utils/Task.js");

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
  const tasks = await Task.find({ user: user });
  res.send(tasks);
});

//add task to the kanban board
app.post("/api/addTask", async (req, res) => {
  const task = req.body;
  const newTask = await Task.create({
    title: task.taskName,
    description: task.taskDesc,
    taskStatus: task.taskStatus,
  });
  console.log("adding task\n", newTask);

  const user = await User.findOne({
    username: userName,
  });

  newTask.user = user;
  await newTask.save();
  user.tasks.push(newTask);
  await user.save();
  
  res.send(await newTask.populate("user"));
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

