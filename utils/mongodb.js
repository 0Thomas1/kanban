const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
let client;
let kanban;
let users;

async function connectToMongoDB() {
  try {
    //single connection to the database
    if (!client) {
      client = new MongoClient(uri);
    }
    await client.connect();
    const database = client.db("Kanban");
    kanban = database.collection("Kanban_Boards");
    users = database.collection("Users");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}
async function getKanbanBoards(userName) {
  try {
    const boards = await kanban.findOne({ username: userName });
    
    return boards;
  } catch (error) {
    console.error(error);
  }
}

// Add a task to the kanban board
async function addTask(task, userName) {
  try {
    const taskWithId = { ...task, 
      id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date() 
    };
    const result = await kanban.updateOne(
      { username: userName },
      { $push: { tasks: taskWithId } }
    );
    return result;
  } catch (error) {
    console.error(error);
  }
}
//change the status of the task
async function changeTaskStatus(taskId, newStatus, userName) {
  try {
    
    const result = await kanban.updateOne(
      { username: userName},
      { $set: { "tasks.$[task].taskStatus": newStatus } },
      { arrayFilters: [{ "task.id": ObjectId.createFromHexString(taskId) }] }
    );
    return result;
  } catch (error) {
    console.error(error);
  }
}

//delete a task
async function deleteTask(taskId, userName) {
  try {
    const result = await kanban.updateOne(
      { username: userName },
      { $pull: { tasks: { id: ObjectId.createFromHexString(taskId) } } }
    );
    return result;
  } catch (error) {
    console.error(error);
  }
}
module.exports = { connectToMongoDB, getKanbanBoards, addTask, changeTaskStatus, deleteTask, kanban, users };
