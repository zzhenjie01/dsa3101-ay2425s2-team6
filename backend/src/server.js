import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRouter from "./api/routes/authRoutes.js";
import weightsRouter from "./api/routes/weightsRoutes.js";
import clicksRouter from "./api/routes/clickRoutes.js";
import createAllTables from "./pgserver.js";

// Set up express server
const app = express();

// Middleware for parsing data/cookies
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Use routers of different paths
app.use("/auth", authRouter);
app.use("/weights", weightsRouter);
app.use("/clicks", clicksRouter);

// pull details from .env file
const mongo_user = process.env.MONGODB_USERNAME;
const mongo_password = process.env.MONGODB_PASSWORD;

// connect to mongodb
mongoose
  .connect(
    `mongodb://${mongo_user}:${mongo_password}@localhost:27017/users?authSource=admin`
  )
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Create all neceesary tables in psql
createAllTables();

// initialise express server
const port = 5000;
app.listen(port, () => console.log("Server running on port 5000"));
