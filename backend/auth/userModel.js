import mongoose from "mongoose";

/*
Connect to users database with following credentials
user: root
password: root.
need to move on .env file
*/

// define userSchema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  environmentalRating: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 50,
  },
  socialRating: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 50,
  },
  governanceRating: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 50,
  },
});

// Create User model
const User = mongoose.model("users", userSchema);

export default User;
