import mongoose from "mongoose";

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
  environmentalWeight: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 50,
  },
  socialWeight: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 50,
  },
  governanceWeight: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 50,
  },
});

// Create User model in mongoDB
const User = mongoose.model("users", userSchema);

export default User;
