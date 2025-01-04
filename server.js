const express = require("express");
const app = express();
const port = 3000;
const root = require("path").join(__dirname, "client");
let activeUsername = "";
const User = require("./utils/User.js");
const Task = require("./utils/Task.js");
const UserModel = require("./utils/UserModel.js");
////MONGOOSE TERRITORY
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;
const options = {
  dbName: "kanban",
};
mongoose.connect(uri).then(() => {
  console.log("Connected to the database");
});
////END OF MONGOOSE TERRITORY

//middleware to parse the request body
app.use(express.json());

//serve the static files
app.use(express.static(root));

//serve the index.html file
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

//get the kanban boards for the user
app.get("/api/boards", async (req, res) => {
  const user = await User.findOne({ username: activeUsername });
  const tasks = await Task.find({ user: user });
  res.send(tasks);
});

//add task to the kanban board
app.post("/api/addTask", async (req, res) => {
  const task = req.body;
  try {
    const newTask = await Task.create({
      title: task.taskName,
      description: task.taskDesc,
      taskStatus: task.taskStatus,
    });
    console.log("adding task\n", newTask);

    const user = await User.findOne({
      username: activeUsername,
    });

    newTask.user = user;
    await newTask.save();
    user.tasks.push(newTask);
    await user.save();

    res.send(await newTask.populate("user"));
  } catch (e) {
    res.status(500).send({ message: "Error adding task", e });
  }
});

//change the status of the task
app.put("/api/changeTaskStatus", async (req, res) => {
  try {
    const taskId = req.body.taskId;
    const newStatus = req.body.newStatus;
    const task = await Task.findById(taskId);
    if (task) {
      console.log("Changing status:\n", task);

      task.taskStatus = newStatus;
      await task.save();
      res.send(task);
    } else {
      res.status(404).send({ message: "Task not found" });
    }
  } catch (e) {
    res.status(500).send({ message: "Error changing task status", e });
  }
});

//delete the task
app.put("/api/deleteTask", async (req, res) => {
  const taskId = req.body.taskId;
  try {
    const task = await Task.findById(taskId);

    if (task) {
      console.log("Deleting task:\n", task);

      await task.removeSelf();
      res.send({ message: "Task deleted" });
    } else {
      res.status(404).send({ message: "Task not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Error deleting task", e });
  }
});
//register the user
app.post("/api/register", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  try {
    await UserModel.registerUser(username, email, password);
    res.send({ message: "User registered" });
  } catch (e) {
    res.status(500).send({ message: "Error registering user", e });
  }
});

//login the user
app.post("/api/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const result = await UserModel.loginUser(username, password);
  if (result.auth === false) {
    console.log("Login failed", result.message);
    res.status(401).send({ message: result.message });
  }
  if (result.auth === true) {
    activeUsername = username;
    res.status(200).send({message: result.message});
  }
});

//logout the user
app.get("/api/logout", async (req, res) => {
  activeUsername = "";
  res.status(200).send({ message: "Logged out" });
});

//start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
