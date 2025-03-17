import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import router from "./authRoutes.js";
import client from "./postgresDB.js";

// Set up express server
const app = express();

// Middleware for parsing data/cookies
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

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

await client
  .query(
    `CREATE TABLE IF NOT EXISTS 
  weight_transactions(
  user_id text NOT NULL,
  transaction_datetime TIMESTAMP NOT NULL,
  environmental_weight INTEGER NOT NULL,
  social_weight INTEGER NOT NULL,
  governance_weight INTEGER NOT NULL
  )`
  )
  .then(() =>
    console.log("weight_transactions table created in postgres database")
  )
  .catch((error) => console.error("Table creation error:", error));

// initialise express server
const port = 5000;
app.listen(port, () => console.log("Server running on port 5000"));
