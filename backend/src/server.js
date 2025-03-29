import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./api/routes/authRoutes.js";
import weightsRouter from "./api/routes/weightsRoutes.js";
import clicksRouter from "./api/routes/clickRoutes.js";
import companyRouter from "./api/routes/companyRoutes.js";
import setupMongoDB from "./mongoDB.js";
import setupPG from "./pgDB.js";

/*
Sets up all the backend services:
- Express Server to receive and handle API calls from the frontend
- MongoDB - Company and User collections
- PostgreSQL DB - Weight Transactions, Click Transactions and Company Stock Price data
*/

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
app.use("/company", companyRouter);

// Connect to MongoDB and create all the necessary tables
setupMongoDB();

// Create all necessary tables in psql
setupPG();

// initialise express server
const port = process.env.PORT;
app.listen(port, () => console.log(`Server running on port ${port}`));
