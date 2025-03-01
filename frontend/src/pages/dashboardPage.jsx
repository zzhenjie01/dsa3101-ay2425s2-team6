import "./dashboardPage.css";
import { useState, useEffect } from "react";
import SidePanel from "../components/SidePanel";
import NavBar from "../components/NavBtn";
import ChatbotDiv from "../components/ChatbotToggle";
import { SidePanelContext } from "../context/contexts";
import EnvironmentalCard from "../components/environmentalCard";

// const sidePanelButtonsLst = [
//   { idx: 1, buttonName: "ESG Dashboard", onClickText: "ESG Dashboard View" },
//   { idx: 2, buttonName: "Edit Weights", onClickText: "Edit Weights View" },
//   {
//     idx: 3,
//     buttonName: "Company Summary",
//     onClickText: "Company Summary View",
//   },
//   {
//     idx: 4,
//     buttonName: "Company Financial Indicators",
//     onClickText: "Company Financial Indicators View",
//   },
// ];

export default function DashboardPage() {
  // const [sidePanelIsOpen, setSidePanelIsOpen] = useState(false);
  // const sidePanelToggleObj = {
  //   sidePanelIsOpen,
  //   setSidePanelIsOpen,
  // };
  // return (
  //   <>
  //     <SidePanelContext.Provider value={sidePanelToggleObj}>
  //       <NavBar />
  //       <SidePanel buttonLst={sidePanelButtonsLst} />
  //     </SidePanelContext.Provider>
  //     <ChatbotDiv />
  //   </>
  // );

  const companyLst = [
    {
      idx: 1,
      companyName: "ABC",
      data: {
        environmental: {
          ghg: {
            2021: { scope1: 10, scope2: 30, scope3: 500 },
            2023: { scope1: 50, scope2: 100, scope3: 800 },
            2022: { scope1: 20, scope2: 60, scope3: 400 },
          },
          energy: {
            2021: 15000,
            2022: 16000,
            2023: 16500,
          },
          water: { 2023: 20000 },
        },
        social: {
          turnover: { 2023: { rate: 11.3 } },
          gender_pay_gap: { 2023: false },
          avg_training_hrs: {
            2021: { total: 200000, male: 150000, female: 50000 },
            2022: { total: 140000, male: 100000, female: 40000 },
            2023: { total: 100000, male: 50000, female: 50000 },
          },
        },
        governance: {
          board_gender: { 2023: { male: 60, female: 40 } },
          no_corruption_cases: { 2023: 2 },
        },
      },
    },
    {
      idx: 2,
      companyName: "XYZ",
      data: {
        environmental: {
          ghg: {
            2021: { scope1: 10, scope2: 20, scope3: 40 },
            2022: { scope1: 20, scope2: 30, scope3: 40 },
            2023: { scope1: 10, scope2: 10, scope3: 20 },
          },
          energy: {
            2021: 5000,
            2022: 6000,
            2023: 4500,
          },
          water: { 2023: 70000 },
        },
        social: {
          turnover: { 2023: { total: 1250 } },
          gender_pay_gap: { 2023: true },
          avg_training_hrs: {
            2021: { total: 200000, male: 150000, female: 50000 },
            2022: { total: 140000, male: 100000, female: 40000 },
            2023: { total: 100000, male: 50000, female: 50000 },
          },
        },
        governance: {
          board_gender: { 2023: { male: 30, female: 70 } },
          no_corruption_cases: { 2023: 0 },
        },
      },
    },

    {
      idx: 3,
      companyName: "Industry Average",
      data: {
        environmental: {
          ghg: {
            2021: { scope1: 30, scope2: 40, scope3: 40 },
            2022: { scope1: 50, scope2: 39, scope3: 100 },
            2023: { scope1: 57, scope2: 60, scope3: 85 },
          },
          energy: {
            2021: 5800,
            2022: 4500,
            2023: 6900,
          },
          water: { 2023: 56000 },
        },
        social: {
          turnover: { 2023: { total: 1890 } },
          gender_pay_gap: { 2023: true },
          avg_training_hrs: {
            2021: { total: 500000, male: 300000, female: 200000 },
            2022: { total: 160000, male: 100000, female: 60000 },
            2023: { total: 180000, male: 90000, female: 90000 },
          },
        },
        governance: {
          board_gender: { 2023: { male: 40, female: 60 } },
          no_corruption_cases: { 2023: 1 },
        },
      },
    },
  ];

  const [allCompanyDetails, setAllCompanyDetails] = useState([]);

  const [currCompanyDetails, setCurrCompanyDetails] = useState(null);

  /*Fetch all company data from API*/
  //   useEffect(() => {
  //     fetch("???")
  //         .then(res => res.json())
  //         .then(data => setAllCompanyDetails(data))
  // }, [])
  useEffect(() => {
    setAllCompanyDetails(companyLst);
  }, []);

  const avgDetails = allCompanyDetails.find(
    (comp) => comp.companyName === "Industry Average"
  );

  function getCurrCompanyDetails(event) {
    if (!event.target.value) {
      setCurrCompanyDetails(null);
    } else {
      setCurrCompanyDetails(JSON.parse(event.target.value));
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
        {currCompanyDetails && (
          <EnvironmentalCard
            data={currCompanyDetails.data.environmental}
            name={currCompanyDetails.companyName}
            avgdata={avgDetails.data.environmental}
          />
        )}
      </div>
    </>
  );
}
