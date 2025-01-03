const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  taskStatus: String,
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});



module.exports = mongoose.model("Task", taskSchema);
