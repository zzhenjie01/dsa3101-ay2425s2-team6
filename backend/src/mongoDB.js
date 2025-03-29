import "dotenv/config";
import mongoose from "mongoose";
import Company from "./api/models/companyModel.js";
import extracted_output from "../esg_data.json" with {type: "json"};
import { esgScoring } from "./esgScoresHelper.js";

/*
Connects to the mongoDB backend based on our user and password
Inserts all companies' data into our 'companies' collection so that our features are able to use the data
*/

// pull details from .env file
const mongo_user = process.env.MONGODB_USERNAME;
const mongo_password = process.env.MONGODB_PASSWORD;
const database_name = "data"

// connect to mongodb
export const setupMongoDB = async () => {
  mongoose
    .connect(
      `mongodb://${mongo_user}:${mongo_password}@localhost:27017/${database_name}?authSource=admin`
    )
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error));

  // gets the esg and average esg scores of all companies for the relevant years
  const { esgScores: leaderboardData, avgEsgScores }  = esgScoring();

  // go through each company and year to input the necessary data into our mongoDB 'companies' collection
  for (const company of extracted_output) {
    const companyName = company["companyName"]
    const companyData = company["data"]
    const data = []

    for (const companyYear in companyData) {
      const companyMetrics = companyData[companyYear]
      const tempData = {"year": companyYear, "metrics": companyMetrics}
      data.push(tempData)
    }

    const companyExists = await Company.findOne({name: companyName});
    
    // Will only create the company in our database if it does not already exist
    if (!companyExists){
      await Company.create({
        name:companyName,
        data:data,
        leaderboard: leaderboardData[companyName],
        avgEsgScores: avgEsgScores[companyName]
      })
    }
  }

  console.log("MongoDB successfully setup!")
};

export default setupMongoDB;
