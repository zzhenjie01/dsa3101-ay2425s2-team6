import mongoose from "mongoose";
import "dotenv/config";
/*
Connect to users database with following credentials
user: root
password: root.
need to move on .env file
*/

// pull details from .env file
const user = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose
  .connect(
    `mongodb://${user}:${password}@localhost:27017/users?authSource=admin`
  )
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

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
