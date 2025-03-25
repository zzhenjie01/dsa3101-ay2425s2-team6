import company_data from "../../esg_data.json" with {type: "json"};

export function leaderboardScoring() {
  function logMinMaxScaling(data) {
    let metricsData = {};

    // Extract all metric values for all years
    data.forEach((company) => {
      Object.entries(company.data).forEach(([year, yearData]) => {
        Object.entries(yearData).forEach(([metric, value]) => {
          if (!metricsData[year]) metricsData[year] = {};
          if (!metricsData[year][metric]) metricsData[year][metric] = [];

          if (
            ["Board of Director gender ratio", "Gender ratio"].includes(metric)
          ) {
            metricsData[year][metric].push({
              company: company.companyName,
              input_value: Math.abs(50 - value), // Deviation from equal gender ratio
            });
          } else {
            metricsData[year][metric].push({
              company: company.companyName,
              input_value: value,
            });
          }
        });
      });
    });

    // Apply log min-max scaling per year
    let scaledMetrics = {};

    //First iterate by year
    Object.entries(metricsData).forEach(([year, metrics]) => {
      scaledMetrics[year] = {};

      //Now iterate by metric
      Object.entries(metrics).forEach(([metric, values]) => {
        let logValues = values.map((entry) => ({
          company: entry.company,
          logValue: Math.log(entry.input_value + 1), // Apply log transformation
        }));

        //Get min and max log values
        let minLog = Math.min(...logValues.map((e) => e.logValue));
        let maxLog = Math.max(...logValues.map((e) => e.logValue));

        //Scale the values of each metric
        let scaledValues = logValues.map((entry) => ({
          company: entry.company,
          scaledValue:
            maxLog !== minLog
              ? (1 - (entry.logValue - minLog) / (maxLog - minLog)) * 100
              : 0, // Invert scores: lower metric value = better score
        }));

        scaledMetrics[year][metric] = scaledValues;
      });
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

    let companyScores = {};

    // Iterate over scaled metrics for each year
    Object.entries(scaledMetrics).forEach(([year, metrics]) => {
      Object.entries(metrics).forEach(([metric, values]) => {
        values.forEach(({ company, scaledValue }) => {
          if (!companyScores[company]) companyScores[company] = {};
          if (!companyScores[company][year])
            companyScores[company][year] = { E: [], S: [], G: [] };

          // Assign metrics to the right ESG category
          if (environmentalMetrics.includes(metric)) {
            companyScores[company][year].E.push(scaledValue);
          } else if (socialMetrics.includes(metric)) {
            companyScores[company][year].S.push(scaledValue);
          } else if (governanceMetrics.includes(metric)) {
            companyScores[company][year].G.push(scaledValue);
          }
        });
      });
    });

    //Combine ESG scores to take key as company name, and a map object as a value, with year as key and object of metrics as value
    let esgScores = Object.fromEntries(
      Object.entries(companyScores).map(([company, years]) => [
        company,
        Object.fromEntries(
          Object.entries(years).map(([year, scores]) => [
            year,
            {
              environmentalScore: scores.E.length
                ? scores.E.reduce((a, b) => a + b, 0) / scores.E.length
                : null,
              socialScore: scores.S.length
                ? scores.S.reduce((a, b) => a + b, 0) / scores.S.length
                : null,
              governanceScore: scores.G.length
                ? scores.G.reduce((a, b) => a + b, 0) / scores.G.length
                : null,
            },
          ])
        ),
      ])
    );

    return esgScores;
  }
  return calculateESGScores(logMinMaxScaling(company_data));
}
