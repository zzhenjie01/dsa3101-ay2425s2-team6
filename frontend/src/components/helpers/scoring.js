import { company_data } from "./esg_data";

// console.log(company_data);

export function scoring() {
  function logMinMaxScaling(data) {
    // Identify the latest year available
    const latestYear = Math.max(
      ...data.map((company) =>
        Math.max(...Object.keys(company.data).map(Number))
      )
    );

    let metricsData = {};

    // Extract all metric values for the latest year
    data.forEach((company) => {
      if (company.data[latestYear]) {
        Object.entries(company.data[latestYear]).forEach(([metric, value]) => {
          if (!metricsData[metric]) metricsData[metric] = [];

          if (
            ["Board of Director gender ratio", "Gender ratio"].includes(metric)
          ) {
            metricsData[metric].push({
              company: company.companyName,
              input_value: Math.abs(50 - value),
            }); //calculate deviation from equal gender ratio
          } else {
            metricsData[metric].push({
              company: company.companyName,
              input_value: value,
            });
          }
        });
      }
    });

    // Apply log min-max scaling
    let scaledMetrics = {};
    Object.entries(metricsData).forEach(([metric, values]) => {
      let logValues = values.map((entry) => ({
        company: entry.company,
        logValue: Math.log(entry.input_value + 1), // Apply log transformation
      }));

      let minLog = Math.min(...logValues.map((e) => e.logValue));
      let maxLog = Math.max(...logValues.map((e) => e.logValue));

      let scaledValues = logValues.map((entry) => ({
        company: entry.company,
        scaledValue:
          maxLog !== minLog
            ? (1 - (entry.logValue - minLog) / (maxLog - minLog)) * 100 //invert the scores since the lower a metric is, the better the score should be
            : 0,
      }));

      scaledMetrics[metric] = scaledValues;
    });

    return scaledMetrics;
  }

  function calculateESGScores(scaledMetrics) {
    // Define metric categories
    const environmentalMetrics = [
      "GHG emissions",
      "Electricity consumption",
      "Water consumption",
    ];
    const socialMetrics = ["Turnover rate", "Gender ratio"];
    const governanceMetrics = [
      "Board of Director gender ratio",
      "Number of Corruption cases",
    ];

    let companyId = 1; // Start _id from 1
    let companyScores = {};

    // Iterate over scaled metrics
    Object.entries(scaledMetrics).forEach(([metric, values]) => {
      values.forEach(({ company, scaledValue }) => {
        if (!companyScores[company]) {
          companyScores[company] = {
            _id: companyId++,
            E: [],
            S: [],
            G: [],
          };
        }

        // Assign metrics to the right ESG category

        if (environmentalMetrics.includes(metric)) {
          companyScores[company].E.push(scaledValue);
        } else if (socialMetrics.includes(metric)) {
          companyScores[company].S.push(scaledValue);
        } else if (governanceMetrics.includes(metric)) {
          companyScores[company].G.push(scaledValue);
        }
      });
    });

    // Compute mean ESG scores for each company
    let esgScores = Object.entries(companyScores).map(([company, scores]) => ({
      _id: scores._id,
      company,
      environmentalScore: scores.E.length
        ? scores.E.reduce((a, b) => a + b, 0) / scores.E.length
        : null,
      socialScore: scores.S.length
        ? scores.S.reduce((a, b) => a + b, 0) / scores.S.length
        : null,
      governanceScore: scores.G.length
        ? scores.G.reduce((a, b) => a + b, 0) / scores.G.length
        : null,
    }));

    return esgScores;
  }

  return calculateESGScores(logMinMaxScaling(company_data));
}
