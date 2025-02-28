import "./dashboardPage.css";
import { useState, useEffect } from "react";
import SidePanel from "../components/SidePanel";
import NavBar from "../components/NavBtn";
import ChatbotDiv from "../components/ChatbotToggle";
import { SidePanelContext } from "../context/contexts";
import EnvironmentalCard from "../components/environmentalCard";

import TestComponent from "@/components/testComponent";

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
            2022: { scope1: 20, scope2: 60, scope3: 400 },
            2023: { scope1: 50, scope2: 100, scope3: 800 },
          },
          energy: {
            2021: { total_energy: 15000, electricity: 8500 },
            2022: { total_energy: 16000, electricity: 9000 },
            2023: { total_energy: 16500, electricity: 9000 },
          },
          water: { 2023: 50000 },
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
            2023: { scope1: 50, scope2: 60, scope3: 80 },
          },
          energy: {
            2021: { total_energy: 5000, electricity: 3500 },
            2022: { total_energy: 6000, electricity: 4000 },
            2023: { total_energy: 6500, electricity: 4000 },
          },
          water: { 2023: 10000 },
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
  ];

  const [company, setCompany] = useState(null);

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

  function getCompanyDetails(event) {
    setCompany(event.target.value);

    const companyInfo = allCompanyDetails.find(
      (company) => company.companyName === event.target.value
    );

    setCurrCompanyDetails(companyInfo || null);
  }

  console.log(currCompanyDetails);

  return (
    <>
      <div className="flex-grow pt-30 text-center">
        <h1>ESG Report Dashboard</h1>
        <label>
          Select a company:
          <select name="selectedCompany" onChange={getCompanyDetails}>
            <option></option>
            {allCompanyDetails.map((company) => (
              <option key={company.idx} value={company.companyName}>
                {company.companyName}
              </option>
            ))}
          </select>
        </label>
        {currCompanyDetails !== null && (
          <EnvironmentalCard data={currCompanyDetails.data.environmental} />
        )}
      </div>
      <div>{<TestComponent />}</div>
    </>
  );
}
