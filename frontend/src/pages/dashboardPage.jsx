import { useState, useEffect, useContext } from "react";
import EnvironmentalCard from "../components/environmentalCard";
import SocialCard from "../components/socialCard";
import GovernanceCard from "../components/governanceCard";
import { UserContext } from "@/context/context";
import axios from "axios";

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

  const companyLst = [
    {
      idx: 1,
      companyName: "ABC",
      data: {
        2021: {
          "GHG emissions": 120,
          "Electricity consumption": 15000,
          "Water consumption": 16000,
          "Gender ratio": "75%",
          "Turnover rate": 11.3,
          "Board of Director gender ratio": "95%",
          "Number of Corruption cases": 2,
        },
        2022: {
          "GHG emissions": 150,
          "Electricity consumption": 18400,
          "Water consumption": 17800,
          "Gender ratio": "75%",
          "Turnover rate": 11.3,
          "Board of Director gender ratio": "80%",
          "Number of Corruption cases": 2,
        },
        2023: {
          "GHG emissions": 180,
          "Electricity consumption": 19200,
          "Water consumption": 17400,
          "Gender ratio": "75%",
          "Turnover rate": 11.3,
          "Board of Director gender ratio": "60%",
          "Number of Corruption cases": 2,
        },
      },
    },

    {
      idx: 2,
      companyName: "XYZ",
      data: {
        2021: {
          "GHG emissions": 100,
          "Electricity consumption": 5000,
          "Water consumption": 4500,
          "Gender ratio": "75%",
          "Turnover rate": 11.3,
          "Board of Director gender ratio": "40%",
          "Number of Corruption cases": 2,
        },
        2022: {
          "GHG emissions": 90,
          "Electricity consumption": 8000,
          "Water consumption": 6000,
          "Gender ratio": "75%",
          "Turnover rate": 11.3,
          "Board of Director gender ratio": "43%",
          "Number of Corruption cases": 2,
        },
        2023: {
          "GHG emissions": 65,
          "Electricity consumption": 5500,
          "Water consumption": 6100,
          "Gender ratio": "75%",
          "Turnover rate": 11.3,
          "Board of Director gender ratio": "51%",
          "Number of Corruption cases": 2,
        },
      },
    },

    {
      idx: 3,
      companyName: "Industry Average",
      data: {
        2021: {
          "GHG emissions": 145,
          "Electricity consumption": 11000,
          "Water consumption": 5500,
          "Gender ratio": "75%",
          "Turnover rate": 11.3,
          "Board of Director gender ratio": "75%",
          "Number of Corruption cases": 2,
        },
        2022: {
          "GHG emissions": 130,
          "Electricity consumption": 11500,
          "Water consumption": 6700,
          "Gender ratio": "75%",
          "Turnover rate": 11.3,
          "Board of Director gender ratio": "73%",
          "Number of Corruption cases": 2,
        },
        2023: {
          "GHG emissions": 124,
          "Electricity consumption": 12100,
          "Water consumption": 6300,
          "Gender ratio": "75%",
          "Turnover rate": 11.3,
          "Board of Director gender ratio": "71%",
          "Number of Corruption cases": 2,
        },
      },
    },
  ];

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
