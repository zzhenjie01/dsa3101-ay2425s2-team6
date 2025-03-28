import User from "../models/userModel.js";
import pgPool from "../models/postgresDB.js";
import { getCosineSimilarity, getAllUserTopCompanies } from "./clickHelper.js";

/* 
Contains all the functions for the /clicks API route
Currently using Axios and Express server for API handling
The API routes can be found in its respective file in the /routes folder
*/

export const insertClick = async (req, res) => {
  try {
    // Simply take the user and company name, and inserts a log into our click_transactions collections to indicate the datetime a user looked at a company
    const { user, name: companyName } = req.body;
    const userExists = await User.findById(user._id);

    // If the user exists and the company name is not null, we will insert the record into our collection
    if (userExists && companyName !== null) {
      await pgPool.query(
        `
        INSERT INTO click_transactions
          (user_id,
          click_datetime, 
          company_name)
        VALUES
          ($1, NOW(), $2)
        `,
        [
          `_${user._id.toString()}`, // value cannot start with a digit
          companyName,
        ]
      );

      res.json("Company click successfully inserted into postgres.");
    } else {
      res.json("Guest User detected.");
    }
  } catch (error) {
    console.log("Error with inserting click into postgres:", error);
    res
      .status(500)
      .json({ error: "An error occurred while inserting clicks." });
  }
};

export const getUserRecommendations = async (req, res) => {
  try {
    // We will retrieve the user's average weights, as well as all other user's average weights
    const { userAvgWeights, allOtherAvgWeights } = req.query;

    // We will also call our helper function to get all user's top companies - this will be used for our calculations later
    const allUserTopCompanies = await getAllUserTopCompanies();

    // Get the user rankings based on their cosine similarity
    // We will use the reduce method to easily decompose all the weights
    const userRankings = allOtherAvgWeights.reduce((acc, otherUser) => {
      // For each user, we will get their average weights, which is the average of the 5 most recent weight configurations
      const otherWeights = {
        environmentalWeight: otherUser.avg_environmental_weight,
        socialWeight: otherUser.avg_social_weight,
        governanceWeight: otherUser.avg_governance_weight,
      };

      // acc is the initial dictionary/mapper object, where we will store each other user's cosine similarity with our current user
      acc[otherUser.user_id] = getCosineSimilarity(
        userAvgWeights,
        otherWeights
      );

      return acc;
    }, {});

    // Get the top 3 most similar user ids based on their cosine similarities
    const similarUsers = Object.entries(userRankings)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([userId]) => userId);

    // Create mappings for each user and their respective first, second and third companies using the reduce method
    const userCompaniesMap = allUserTopCompanies.reduce((acc, entry) => {
      acc[entry.user_id] = [
        entry.first_company,
        entry.second_company,
        entry.third_company,
      ];
      return acc;
    }, {});

    // We will now score the top companies based on the user's top 3 companies and their similarity to our current user
    const companyRankings = similarUsers.reduce((acc, userId, rankIndex) => {
      const companies = userCompaniesMap[userId] || [];
      const reciprocalRank = 1 / (rankIndex + 1); // we will use reciprocal ranking for the users

      // we will iterate through each company and their position in the list
      // we assign a linear score to each company based on their ranking
      companies.forEach((company, position) => {
        if (!company) return; // if company is null, return
        const weight = [3, 2, 1][position] * reciprocalRank; // weight is determined by the company's rank of the user, and the user's similarity rank of our current user
        acc[company] = (acc[company] || 0) + weight;
      });

      return acc;
    }, {});

    // based on the company rankings, we will simply sort in descending order and get top 5 company names
    const finalRecommendations = Object.entries(companyRankings)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([company]) => company);

    res.json(finalRecommendations);
  } catch (error) {
    console.error("Error getting User Reccomendations:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};

export default {
  insertClick,
  getUserRecommendations,
};
