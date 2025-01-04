const User = require("./User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const saltRounds = 10;
async function registerUser(username, email, password) {
  if (await User.exists({ username: username })) {
    throw new Error("Username already exists");
  }
  if (await User.exists({ email: email })) {
    throw new Error("Email already exists");
  }

  bcrypt.hash(password, saltRounds, async function (err, hash) {
    const newUser = await User.create({
      username: username,
      email: email,
      password: hash,
    });
    await newUser.save();
    console.log("User created\n", newUser);
    return newUser;
  });
}

async function loginUser(username, password) {
  const user = await User.findOne({
    username: username,
  });
  if (!user) {
    return { message: "User not found", auth: false };
  }
  const result = await bcrypt.compare(password, user.password);
  if (result) {
    console.log("Login successful");
    return { message: "Login successful", auth: true };
  } else {
    return { message: "Incorrect password", auth: false };
  }
}

module.exports = {
  registerUser,
  loginUser,
};
