import Company from "../models/companyModel.js";
import pgPool from "../models/postgresDB.js";

export const getAllCompanyData = async (req, res) => {
  const allCompanyData = await Company.find();

  const outputList = [];
  var i = 1;
  const metricIndustrialAverage = {};
  const yearCompaniesCount = {};
  const metrics = [
    "GHG emissions",
    "Electricity consumption",
    "Water consumption",
    "Gender ratio",
    "Turnover rate",
    "Board of Director gender ratio",
    "Number of Corruption cases",
  ];

  for (const companyObject of allCompanyData) {
    const companyName = companyObject["name"];
    const companyData = companyObject["data"];
    const companyMetrics = [];

    for (const yearObject of companyData) {
      const year = parseInt(yearObject["year"]);
      const metrics = yearObject["metrics"];
      const yearMetrics = { [year]: metrics };
      companyMetrics.push(yearMetrics);

      // Store data for the calculation of IndustrialAverage data later on
      if (!(year in metricIndustrialAverage)) {
        metricIndustrialAverage[year] = {};
      }

      for (const metric in metrics) {
        if (!(metric in metricIndustrialAverage[year])) {
          metricIndustrialAverage[year][metric] = 0;
        }
        metricIndustrialAverage[year][metric] += parseFloat(metrics[metric]);
      }

      if (!(year in yearCompaniesCount)) {
        yearCompaniesCount[year] = 0;
      }
      yearCompaniesCount[year]++;
    }

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

    const companyForecast = {
      "Existing Data": actualStockPrices.rows,
      "Forecasted Data": predictedStockPrices.rows,
    };

    const companyListObj = {
      idx: i,
      name: companyName,
      data: companyMetrics,
      forecast: companyForecast,
    };

    outputList.push(companyListObj);
    i++;
  }

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

  const industrialAverageObj = {
    idx: i,
    name: "Industry Average",
    data: finalIndustrialAverage,
  };
  outputList.push(industrialAverageObj);

  console.log(outputList);
  res.json(outputList);
};

export default { getAllCompanyData };
