import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import router from "./authRoutes.js";

// Set up express server
const app = express();

// Middleware for parsing data/cookies
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

// pull details from .env file
const user = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

// connect to mongodb
mongoose
  .connect(
    `mongodb://${user}:${password}@localhost:27017/users?authSource=admin`
  )
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

const port = 5000;
app.listen(port, () => console.log("Server running on port 5000"));
