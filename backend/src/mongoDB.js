import "dotenv/config";
import mongoose from "mongoose";
import Company from "./api/models/companyModel.js";
import extracted_output from "../esg_data.json" with {type: "json"};
import { esgScoring } from "./api/esgScoresHelper.js";

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

  const { esgScores: leaderboardData, avgEsgScores }  = esgScoring();

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
