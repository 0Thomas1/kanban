const mongoose = require("mongoose");
const User = require("./User");
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
//static method


//private instance method
taskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});


taskSchema.methods.removeSelf = async function () {
  await User.updateOne(
    { _id: this.user },
    { $pull: { tasks: this._id } }
  );
  return this.deleteOne();
};


taskSchema.methods.changeStatus = async function (newStatus) {
  this.taskStatus = newStatus;
  return this.save();
};


module.exports = mongoose.model("Task", taskSchema);
