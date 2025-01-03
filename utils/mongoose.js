const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
const User = require('./User');
const Task = require('./User');

mongoose.connect(uri);
 
module.exports = {"mongoose": mongoose, "User": User};
