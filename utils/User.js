const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  }],
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("User", userSchema);
