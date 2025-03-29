import Company from "../models/companyModel.js";
import pgPool from "../models/postgresDB.js";

/* 
Contains all the functions for the /company API route
Currently using Axios and Express server for API handling
The API routes can be found in its respective file in the /routes folder
*/

export const getAllCompanyData = async (req, res) => {
  // Get all data from 'companies' mongoDB collection
  const allCompanyData = await Company.find();

  const outputList = []; // list to store each company's data as a json object
  var i = 1; // id for company
  const metricIndustrialAverage = {}; // store industrial average for each metric
  const yearCompaniesCount = {}; // store the number of companies' data we have for each year - to be used in calculation of industrial average
  const metrics = [
    "GHG emissions",
    "Electricity consumption",
    "Water consumption",
    "Gender ratio",
    "Turnover rate",
    "Board of Director gender ratio",
    "Number of Corruption cases",
  ]; // initialise metrics to be used

  // for each company object in mongoDB
  for (const companyObject of allCompanyData) {
    const companyName = companyObject["name"];
    const companyData = companyObject["data"];
    const companyLeaderboard = companyObject["leaderboard"];
    const companyAvgEsgScores = companyObject["avgEsgScores"];
    const companyMetrics = [];

    // for each year in the company data
    for (const yearObject of companyData) {
      const year = parseInt(yearObject["year"]);
      const metrics = yearObject["metrics"];
      const yearMetrics = { [year]: metrics };
      companyMetrics.push(yearMetrics);

      // Store data for the calculation of IndustrialAverage data later on
      if (!(year in metricIndustrialAverage)) {
        metricIndustrialAverage[year] = {};
      }

      // to add the metric value into the industrial average
      for (const metric in metrics) {
        if (!(metric in metricIndustrialAverage[year])) {
          metricIndustrialAverage[year][metric] = 0;
        }
        metricIndustrialAverage[year][metric] += parseFloat(metrics[metric]);
      }

      // add the company count to the respective year
      if (!(year in yearCompaniesCount)) {
        yearCompaniesCount[year] = 0;
      }
      yearCompaniesCount[year]++;
    }

    // get the actual stock prices
    const actualStockPrices = await pgPool.query(
      `SELECT 
      DATE(price_date) as date,
      price as value
      FROM company_stock_data
      WHERE LOWER(company_name) LIKE '%' || LOWER($1) || '%'
      AND price_type = 'Actual'
      ORDER BY price_date ASC
      `,
      [companyName]
    );

    // get the predicted/forecasted stock prices
    const predictedStockPrices = await pgPool.query(
      `SELECT
      DATE(price_date) as date,
      price as value
      FROM company_stock_data
      WHERE LOWER(company_name) LIKE '%' || LOWER($1) || '%'
      AND price_type = 'Predicted'
      ORDER BY price_date ASC
      `,
      [companyName]
    );

    // add the respective data to be included in the company data
    const companyForecast = {
      "Existing Data": actualStockPrices.rows,
      "Forecasted Data": predictedStockPrices.rows,
    };

    // compile all the data into a json object to be added into the output list
    const companyListObj = {
      idx: i,
      name: companyName,
      data: companyMetrics,
      forecast: companyForecast,
      leaderboard: companyLeaderboard,
      avgEsgScores: companyAvgEsgScores,
    };

    outputList.push(companyListObj);
    i++; // increase idx for each company
  }

  // to calculate the actual average using the sum of the metrics and count of companies of each year
  const finalIndustrialAverage = {};
  for (const year in yearCompaniesCount) {
    if (!(year in finalIndustrialAverage)) {
      finalIndustrialAverage[year] = {};
    }
    for (const metric of metrics) {
      finalIndustrialAverage[year][metric] =
        metricIndustrialAverage[year][metric] / yearCompaniesCount[year];
    }
  }

  // industrial average object to be added at the ended
  const industrialAverageObj = {
    idx: i,
    name: "Industry Average",
    data: finalIndustrialAverage,
  };
  outputList.push(industrialAverageObj);

  res.json(outputList);
};

export default { getAllCompanyData };
