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
    const taskWithId = { ...task, id: new ObjectId() };
    const result = await kanban.updateOne(
      { username: userName },
      { $push: { tasks: taskWithId } }
    );
    return result;
  } catch (error) {
    console.error(error);
  }
}
module.exports = { connectToMongoDB, getKanbanBoards, addTask, kanban, users };
