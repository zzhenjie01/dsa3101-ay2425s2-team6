import mongoose from "mongoose";

/*
Connect to users database with following credentials
user: root
password: root.
need to move on .env file
*/

// define userSchema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create User model
const User = mongoose.model("users", userSchema);

export default User;
