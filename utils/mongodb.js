const { MongoClient, ServerApiVersion } = require("mongodb");
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
    const boards = await kanban.findOne({ Username: userName });

    return boards;
  } catch (error) {
    console.error(error);
  }
}

async function addTask(userName, task, column) {
  try {
    const result = await kanban.updateOne(
      { Username: userName },
      {
        $push: {
          [column]: task,
        },
      }
    );
    return result;
  } catch (error) {
    console.error(error);
  }
}
module.exports = { connectToMongoDB, getKanbanBoards, addTask, kanban, users };
