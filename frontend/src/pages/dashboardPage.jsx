import { useState, useEffect, useContext } from "react";
import EnvironmentalCard from "@/components/dashboard/environmentalCard";
import SocialCard from "@/components/dashboard/socialCard";
import GovernanceCard from "@/components/dashboard/governanceCard";
import { Forecast } from "@/components/dashboard/forecast";
import { UserContext } from "@/context/context";
import axios from "axios";

export default function DashboardPage() {
  const { user } = useContext(UserContext);

  const transformData = (compdata) => {
    if (!compdata || !Array.isArray(compdata)) return [];

    return compdata
      .map((company) => {
        const { idx, name, data, avgEsgScores, forecast = {} } = company; // Default forecast to an empty object

        if (!data) return null; // Ensure `data` exists

        let flattenedData = {};

        // **Handle different formats of `data` (array vs. object)**
        if (Array.isArray(data)) {
          // Convert array of key-value objects into a single object
          flattenedData = data.reduce((acc, yearObj) => {
            const year = Object.keys(yearObj)[0]; // Extract year key (e.g., "2020")
            acc[year] = yearObj[year]; // Assign the year's data to the accumulator
            return acc;
          }, {});
        } else if (typeof data === "object") {
          // If `data` is already an object, use it directly
          flattenedData = data;
        } else {
          return null; // Skip if `data` is neither an array nor an object
        }

        // Get all years and metrics
        const years = Object.keys(flattenedData);
        if (years.length === 0) return null; // Skip company if no data

        const firstYear = years[0];
        const metrics = Object.keys(flattenedData[firstYear] || {});

        // Reorganize data by metric first, then by year, converting values to float
        const transformedData = {};
        metrics.forEach((metric) => {
          transformedData[metric] = {};
          years.forEach((year) => {
            let value = flattenedData[year]?.[metric] || null;

            // Convert numeric values to float, but preserve strings (like gender ratio "75%")
            if (typeof value === "string") {
              const numericValue = parseFloat(value.replace("%", ""));
              value = isNaN(numericValue) ? value : numericValue;
            } else if (typeof value === "number") {
              value = parseFloat(value);
            }

            transformedData[metric][year] = value;
          });
        });

        const outputData = {
          idx,
          name,
          data: transformedData,
          avgEsgScores: avgEsgScores,
          forecast: typeof forecast === "object" ? forecast : {}, // Ensure forecast is an object
        };

        return outputData;
      })
      .filter(Boolean); // Remove null entries (skipped companies)
  };

  // State for all companies details
  const [companyData, setCompanyData] = useState([]); // Start as null

  // Function to fetch data from API
  const fetchCompanyData = async () => {
    try {
      const response = await axios.get("/company/getAllCompanyData");
      setCompanyData(transformData(response.data)); // Store API data in state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  // State for the company details currently selected
  const [currCompanyDetails, setCurrCompanyDetails] = useState(null);

  const avgDetails = companyData.find(
    (comp) => comp.name === "Industry Average"
  );

  // Get current company details in json format, if empty value is selected set it to null
  function getCurrCompanyDetails(event) {
    //if no value, set currCompanyDetails as null
    if (!event.target.value) {
      setCurrCompanyDetails(null);
    } else {
      //set currCompanyDetails as the value of the data key of the company selected
      const companyDetails = JSON.parse(event.target.value);
      const name = companyDetails.name;
      axios.post("clicks/insertClick", {
        user,
        name,
      });
      setCurrCompanyDetails(companyDetails);
    }
  }

  return (
    <>
      <div className="flex-grow pt-30 text-center">
        <h1 className="text-3xl pt-8 pb-16">ESG Report Dashboard</h1>
        <label className="text-lg">
          Select a company:{" "}
          <select
            name="selectedCompany"
            className="border border-solid align-bottom"
            onChange={getCurrCompanyDetails}
          >
            <option></option>
            {companyData.map((comp) => (
              <option key={comp.idx} value={JSON.stringify(comp)}>
                {comp.name}
              </option>
            ))}
          </select>
        </label>
        <>
          {currCompanyDetails && (
            <EnvironmentalCard
              data={{
                "GHG emissions": currCompanyDetails.data["GHG emissions"],
                "Electricity consumption":
                  currCompanyDetails.data["Electricity consumption"],
                "Water consumption":
                  currCompanyDetails.data["Water consumption"],
              }}
              name={currCompanyDetails.name}
              avgdata={{
                "GHG emissions": avgDetails.data["GHG emissions"],
                "Electricity consumption":
                  avgDetails.data["Electricity consumption"],
                "Water consumption": avgDetails.data["Water consumption"],
              }}
            />
          )}
        </>
        <>
          {currCompanyDetails && (
            <SocialCard
              data={{
                "Gender ratio": currCompanyDetails.data["Gender ratio"],
                "Turnover rate": currCompanyDetails.data["Turnover rate"],
              }}
              name={currCompanyDetails.name}
              avgdata={{
                "Gender ratio": avgDetails.data["Gender ratio"],
                "Turnover rate": avgDetails.data["Turnover rate"],
              }}
            />
          )}
        </>
        <>
          {currCompanyDetails && (
            <GovernanceCard
              data={{
                "Board of Director gender ratio":
                  currCompanyDetails.data["Board of Director gender ratio"],
                "Number of Corruption cases":
                  currCompanyDetails.data["Number of Corruption cases"],
              }}
              name={currCompanyDetails.name}
              avgdata={{
                "Board of Director gender ratio":
                  avgDetails.data["Board of Director gender ratio"],
                "Number of Corruption cases":
                  avgDetails.data["Number of Corruption cases"],
              }}
            />
          )}
        </>
        <>
          {currCompanyDetails && currCompanyDetails.forecast && (
            <Forecast
              name={currCompanyDetails.name}
              data={currCompanyDetails.forecast}
              avgEsgScores={currCompanyDetails.avgEsgScores}
            />
          )}
        </>
      </div>
    </>
  );
}
