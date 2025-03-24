import { useState, useEffect, useContext } from "react";
import EnvironmentalCard from "../components/environmentalCard";
import SocialCard from "../components/socialCard";
import GovernanceCard from "../components/governanceCard";
import { UserContext } from "@/context/context";
import axios from "axios";
import { company_data } from "@/components/helpers/esg_data";

export default function DashboardPage() {
  //Sample data for testing
  // const companyLst = [
  //   {
  //     idx: 1,
  //     companyName: "ABC",
  //     data: {
  //       environmental: {
  //         ghg: {
  //           2021: { scope1: 10, scope2: 30, scope3: 500 },
  //           2023: { scope1: 50, scope2: 100, scope3: 800 },
  //           2022: { scope1: 20, scope2: 60, scope3: 400 },
  //         },
  //         energy: {
  //           2021: 15000,
  //           2022: 16000,
  //           2023: 16500,
  //         },
  //         water: { 2023: 20000 },
  //       },
  //       social: {
  //         turnover: { 2023: { rate: 11.3 } },
  //         gender_pay_gap: { 2023: false },
  //         avg_training_hrs: {
  //           2021: { total: 200000, male: 150000, female: 50000 },
  //           2022: { total: 140000, male: 100000, female: 40000 },
  //           2023: { total: 100000, male: 50000, female: 50000 },
  //         },
  //       },
  //       governance: {
  //         board_gender: { 2023: { male: 90, female: 20 } },
  //         no_corruption_cases: { 2023: 2 },
  //       },
  //     },
  //   },
  //   {
  //     idx: 2,
  //     companyName: "XYZ",
  //     data: {
  //       environmental: {
  //         ghg: {
  //           2021: { scope1: 10, scope2: 20, scope3: 40 },
  //           2022: { scope1: 20, scope2: 30, scope3: 40 },
  //           2023: { scope1: 10, scope2: 10, scope3: 20 },
  //         },
  //         energy: {
  //           2021: 5000,
  //           2022: 6000,
  //           2023: 4500,
  //         },
  //         water: { 2023: 70000 },
  //       },
  //       social: {
  //         turnover: { 2023: { total: 1250 } },
  //         gender_pay_gap: { 2023: true },
  //         avg_training_hrs: {
  //           2021: { total: 200000, male: 150000, female: 50000 },
  //           2022: { total: 140000, male: 100000, female: 40000 },
  //           2023: { total: 100000, male: 50000, female: 50000 },
  //         },
  //       },
  //       governance: {
  //         board_gender: { 2023: { male: 30, female: 70 } },
  //         no_corruption_cases: { 2023: 0 },
  //       },
  //     },
  //   },

  //   {
  //     idx: 3,
  //     companyName: "Industry Average",
  //     data: {
  //       environmental: {
  //         ghg: {
  //           2021: { scope1: 30, scope2: 40, scope3: 40 },
  //           2022: { scope1: 50, scope2: 39, scope3: 100 },
  //           2023: { scope1: 57, scope2: 60, scope3: 85 },
  //         },
  //         energy: {
  //           2021: 5800,
  //           2022: 4500,
  //           2023: 6900,
  //         },
  //         water: { 2023: 56000 },
  //       },
  //       social: {
  //         turnover: { 2023: { total: 1890 } },
  //         gender_pay_gap: { 2023: true },
  //         avg_training_hrs: {
  //           2021: { total: 500000, male: 300000, female: 200000 },
  //           2022: { total: 160000, male: 100000, female: 60000 },
  //           2023: { total: 180000, male: 90000, female: 90000 },
  //         },
  //       },
  //       governance: {
  //         board_gender: { 2023: { male: 70, female: 30 } },
  //         no_corruption_cases: { 2023: 1 },
  //       },
  //     },
  //   },
  // ];

  // const companyLst = [
  //   {
  //     idx: 1,
  //     companyName: "ABC",
  //     data: {
  //       2021: {
  //         "GHG emissions": 120,
  //         "Electricity consumption": 15000,
  //         "Water consumption": 16000,
  //         "Gender ratio": "80%",
  //         "Turnover rate": 11.3,
  //         "Board of Director gender ratio": "95%",
  //         "Number of Corruption cases": 5,
  //       },
  //       2022: {
  //         "GHG emissions": 150,
  //         "Electricity consumption": 18400,
  //         "Water consumption": 17800,
  //         "Gender ratio": "70%",
  //         "Turnover rate": 11.9,
  //         "Board of Director gender ratio": "80%",
  //         "Number of Corruption cases": 10,
  //       },
  //       2023: {
  //         "GHG emissions": 180,
  //         "Electricity consumption": 19200,
  //         "Water consumption": 17400,
  //         "Gender ratio": "65%",
  //         "Turnover rate": 12.6,
  //         "Board of Director gender ratio": "90%",
  //         "Number of Corruption cases": 12,
  //       },
  //     },
  //     forecast: {
  //       "existing data": [
  //         { date: "2023-12-11", value: 34.6748 },
  //         { date: "2023-12-12", value: 32.286 },
  //         { date: "2023-12-13", value: 37.1282 },
  //         { date: "2023-12-16", value: 37.7451 },
  //         { date: "2023-12-18", value: 38.8014 },
  //         { date: "2023-12-19", value: 35.367 },
  //         { date: "2023-12-20", value: 32.2403 },
  //         { date: "2023-12-21", value: 31.3015 },
  //         { date: "2023-12-22", value: 36.6504 },
  //         { date: "2023-12-25", value: 35.9448 },
  //         { date: "2023-12-26", value: 36.6109 },
  //         { date: "2023-12-27", value: 39.8475 },
  //         { date: "2023-12-28", value: 32.1224 },
  //         { date: "2023-12-30", value: 36.176 },
  //         { date: "2024-01-03", value: 33.9855 },
  //         { date: "2024-01-04", value: 33.5646 },
  //         { date: "2024-01-07", value: 30.2771 },
  //         { date: "2024-01-08", value: 31.3936 },
  //         { date: "2024-01-09", value: 30.1558 },
  //         { date: "2024-01-10", value: 30.8261 },
  //         { date: "2024-01-11", value: 36.6144 },
  //         { date: "2024-01-12", value: 30.4978 },
  //         { date: "2024-01-13", value: 34.4847 },
  //         { date: "2024-01-14", value: 32.2694 },
  //         { date: "2024-01-15", value: 32.1831 },
  //         { date: "2024-01-17", value: 35.5633 },
  //         { date: "2024-01-19", value: 38.5366 },
  //         { date: "2024-01-20", value: 30.5171 },
  //         { date: "2024-01-22", value: 30.7162 },
  //         { date: "2024-01-23", value: 32.3475 },
  //         { date: "2024-01-24", value: 33.0478 },
  //         { date: "2024-01-25", value: 38.0783 },
  //         { date: "2024-01-26", value: 34.3663 },
  //         { date: "2024-01-27", value: 33.5422 },
  //         { date: "2024-01-28", value: 37.4866 },
  //         { date: "2024-01-29", value: 31.148 },
  //         { date: "2024-01-30", value: 38.3678 },
  //         { date: "2024-02-01", value: 37.8834 },
  //         { date: "2024-02-02", value: 30.2798 },
  //         { date: "2024-02-03", value: 38.1317 },
  //         { date: "2024-02-04", value: 36.5804 },
  //         { date: "2024-02-07", value: 38.3608 },
  //         { date: "2024-02-08", value: 34.1594 },
  //         { date: "2024-02-10", value: 32.9399 },
  //         { date: "2024-02-15", value: 38.6934 },
  //       ],
  //       "forecasted data": [
  //         { date: "2024-02-17", value: 31.0674 },
  //         { date: "2024-02-18", value: 32.4135 },
  //         { date: "2024-02-20", value: 39.1486 },
  //         { date: "2024-02-22", value: 32.6111 },
  //         { date: "2024-02-23", value: 38.5279 },
  //         { date: "2024-02-24", value: 30.1963 },
  //         { date: "2024-02-25", value: 33.1464 },
  //         { date: "2024-02-26", value: 38.1241 },
  //         { date: "2024-02-28", value: 31.1251 },
  //         { date: "2024-03-01", value: 32.6375 },
  //         { date: "2024-03-02", value: 37.4464 },
  //         { date: "2024-03-05", value: 30.0903 },
  //         { date: "2024-03-07", value: 31.672 },
  //       ],
  //     },
  //   },

  //   {
  //     idx: 2,
  //     companyName: "XYZ",
  //     data: {
  //       2021: {
  //         "GHG emissions": 100,
  //         "Electricity consumption": 5000,
  //         "Water consumption": 4500,
  //         "Gender ratio": "45%",
  //         "Turnover rate": 7.1,
  //         "Board of Director gender ratio": "40%",
  //         "Number of Corruption cases": 0,
  //       },
  //       2022: {
  //         "GHG emissions": 90,
  //         "Electricity consumption": 8000,
  //         "Water consumption": 6000,
  //         "Gender ratio": "48%",
  //         "Turnover rate": 6.7,
  //         "Board of Director gender ratio": "43%",
  //         "Number of Corruption cases": 0,
  //       },
  //       2023: {
  //         "GHG emissions": 65,
  //         "Electricity consumption": 5500,
  //         "Water consumption": 6100,
  //         "Gender ratio": "37%",
  //         "Turnover rate": 6.4,
  //         "Board of Director gender ratio": "51%",
  //         "Number of Corruption cases": 0,
  //       },
  //     },
  //     forecast: {
  //       "existing data": [
  //         { date: "2023-12-05", value: 145.23 },
  //         { date: "2023-12-07", value: 147.89 },
  //         { date: "2023-12-09", value: 149.34 },
  //         { date: "2023-12-12", value: 144.78 },
  //         { date: "2023-12-15", value: 146.91 },
  //         { date: "2023-12-18", value: 143.5 },
  //         { date: "2023-12-20", value: 141.78 },
  //         { date: "2023-12-22", value: 139.45 },
  //         { date: "2023-12-26", value: 144.32 },
  //         { date: "2023-12-29", value: 143.11 },
  //         { date: "2024-01-02", value: 145.89 },
  //         { date: "2024-01-05", value: 151.67 },
  //         { date: "2024-01-09", value: 140.45 },
  //         { date: "2024-01-12", value: 146.78 },
  //         { date: "2024-01-16", value: 144.22 },
  //         { date: "2024-01-19", value: 142.88 },
  //         { date: "2024-01-23", value: 138.67 },
  //         { date: "2024-01-26", value: 140.92 },
  //         { date: "2024-01-30", value: 139.45 },
  //         { date: "2024-02-02", value: 141.23 },
  //         { date: "2024-02-06", value: 147.34 },
  //         { date: "2024-02-09", value: 140.22 },
  //         { date: "2024-02-13", value: 144.78 },
  //         { date: "2024-02-16", value: 142.34 },
  //         { date: "2024-02-19", value: 142.01 },
  //         { date: "2024-02-22", value: 145.67 },
  //       ],
  //       "forecasted data": [
  //         { date: "2024-02-24", value: 139.89 },
  //         { date: "2024-02-26", value: 141.56 },
  //         { date: "2024-02-28", value: 148.23 },
  //         { date: "2024-03-02", value: 140.91 },
  //         { date: "2024-03-05", value: 147.88 },
  //         { date: "2024-03-08", value: 138.56 },
  //         { date: "2024-03-10", value: 142.45 },
  //         { date: "2024-03-13", value: 147.12 },
  //         { date: "2024-03-16", value: 139.01 },
  //         { date: "2024-03-19", value: 140.78 },
  //         { date: "2024-03-22", value: 145.34 },
  //         { date: "2024-03-26", value: 137.67 },
  //         { date: "2024-03-29", value: 140.12 },
  //       ],
  //     },
  //   },

  //   {
  //     idx: 3,
  //     companyName: "Industry Average",
  //     data: {
  //       2021: {
  //         "GHG emissions": 145,
  //         "Electricity consumption": 11000,
  //         "Water consumption": 5500,
  //         "Gender ratio": "70%",
  //         "Turnover rate": 10.1,
  //         "Board of Director gender ratio": "75%",
  //         "Number of Corruption cases": 2,
  //       },
  //       2022: {
  //         "GHG emissions": 130,
  //         "Electricity consumption": 11500,
  //         "Water consumption": 6700,
  //         "Gender ratio": "72%",
  //         "Turnover rate": 10.0,
  //         "Board of Director gender ratio": "73%",
  //         "Number of Corruption cases": 5,
  //       },
  //       2023: {
  //         "GHG emissions": 124,
  //         "Electricity consumption": 12100,
  //         "Water consumption": 6300,
  //         "Gender ratio": "71%",
  //         "Turnover rate": 10.7,
  //         "Board of Director gender ratio": "71%",
  //         "Number of Corruption cases": 3,
  //       },
  //     },
  //   },
  // ];

  const companyLst = company_data;

  const companyData = axios.get("/company/getAllCompanyData");

  console.log(companyData);

  const companyData = axios.get("/company/getAllCompanyData");

  const { user } = useContext(UserContext);

  // Function to transform the data
  const transformData = () => {
    return companyLst.map((company) => {
      const { idx, companyName, data } = company;

      // Create a new data structure organized by metric first
      const transformedData = {};

      // Get all years and metrics
      const years = Object.keys(data);

      // Get all metrics from the first year (assuming all years have the same metrics)
      const firstYear = years[0];
      const metrics = Object.keys(data[firstYear]);

      // Reorganize data by metric first, then by year
      metrics.forEach((metric) => {
        transformedData[metric] = {};

        years.forEach((year) => {
          transformedData[metric][year] = data[year][metric];
        });
      });

      return {
        idx,
        companyName,
        data: transformedData,
      };
    });
  };

  // State for all companies details
  const [allCompanyDetails, setAllCompanyDetails] = useState(transformData());

  // console.log(allCompanyDetails);

  // State for the company details currently selected
  const [currCompanyDetails, setCurrCompanyDetails] = useState(null);

  const avgDetails = allCompanyDetails.find(
    (comp) => comp.companyName === "Industry Average"
  );

  // console.log(avgDetails.data[`Turnover rate`]);

  // Get current company details in json format, if empty value is selected set it to null
  function getCurrCompanyDetails(event) {
    if (!event.target.value) {
      setCurrCompanyDetails(null);
    } else {
      const companyDetails = JSON.parse(event.target.value);
      const companyName = companyDetails.companyName;
      axios.post("clicks/insertClick", {
        user,
        companyName,
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
            {allCompanyDetails.map((comp) => (
              <option key={comp.idx} value={JSON.stringify(comp)}>
                {comp.companyName}
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
              name={currCompanyDetails.companyName}
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
                "Gender ratio": currCompanyDetails["Gender ratio"],
                "Turnover rate": currCompanyDetails["Turnover rate"],
              }}
              name={currCompanyDetails.companyName}
              avgdata={{
                "Gender ratio": avgDetails["Gender ratio"],
                "Turnover rate": avgDetails["Turnover rate"],
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
              name={currCompanyDetails.companyName}
              avgdata={{
                "Board of Director gender ratio":
                  avgDetails.data["Board of Director gender ratio"],
                "Number of Corruption cases":
                  avgDetails.data["Number of Corruption cases"],
              }}
            />
          )}
        </>
      </div>
    </>
  );
}
