const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
let client;
let kanban;
let users;

// Connect to the MongoDB database
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
  } catch (error) {
    console.error(error);
  }
}
// Get the kanban boards
async function getKanbanBoards(userName) {
  try {
    const boards = await kanban.findOne({ Username: userName });
    return boards;
  } catch (error) {
    console.error(error);
  }
}
// Add a task to the kanban board
async function addToKanbanBoard(username, column, task) {
  try {
    const board = await kanban.findOne({ Username: username });
    board[column].push(task);
    await kanban.updateOne({ Username: username }, { $set: board });
  } catch (error) {
    console.error(error);
  }
}

// Remove a task from the kanban board
async function removeFromKanbanBoard(username, column, task) {
  try {
    const board = await kanban.findOne({ Username: username });
    board[column] = board[column].filter((t) => t !== task);
    await kanban.updateOne({ Username: username }, { $set: board });
  } catch (error) {
    console.error(error);
  }
}
//Edit a task from the kanban board
async function editTask(username, column, task, newTask) {
  try {
    const board = await kanban.findOne({ Username: username });
    board[column] = board[column].map((t) => (t === task ? newTask : t));
    await kanban.updateOne({ Username: username }, { $set: board });
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  connectToMongoDB,
  getKanbanBoards,
  addToKanbanBoard,
  removeFromKanbanBoard,
  editTask,
  kanban,
  users,
};
