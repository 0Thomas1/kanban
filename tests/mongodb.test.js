const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const { addToKanbanBoard, removeFromKanbanBoard, connectToMongoDB, getKanbanCollection } = require('../utils/mongodb'); // Adjust the path as necessary

let mongoServer;
let client;
let kanban;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  client = new MongoClient(uri);
  await client.connect();
  await connectToMongoDB(client); // Pass the client to your connectToMongoDB function if needed
  kanban = getKanbanCollection(); // Ensure kanban collection is initialized
});

afterAll(async () => {
  if (client) {
    await client.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Kanban Board Utilities', () => {
  const username = 'testuser';
  const column = 'todo';
  const task = 'Test Task';

  beforeEach(async () => {
    await kanban.insertOne({ Username: username, todo: [], inProgress: [], done: [] });
  });

  afterEach(async () => {
    await kanban.deleteMany({});
  });

  test('should add a task to the kanban board', async () => {
    await addToKanbanBoard(username, column, task);
    const board = await kanban.findOne({ Username: username });
    expect(board[column]).toContain(task);
  });

  test('should remove a task from the kanban board', async () => {
    await addToKanbanBoard(username, column, task);
    await removeFromKanbanBoard(username, column, task);
    const board = await kanban.findOne({ Username: username });
    expect(board[column]).not.toContain(task);
  });
});