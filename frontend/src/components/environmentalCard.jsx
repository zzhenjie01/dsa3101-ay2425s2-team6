import "./environmentalCard.css";
import { useContext, useState } from "react";
import { ChatBotContext } from "../context/contexts";
import { OverallGHG } from "./overallGhg";
import { ScopeGHG } from "./scopeGhg";
import { Water } from "./water";

export default function EnvironmentalCard(props) {
  const sumGHGByYear = (ghgData) => {
    return Object.keys(ghgData).reduce((acc, year) => {
      const { scope1 = 0, scope2 = 0, scope3 = 0 } = ghgData[year]; // Default values to 0 if missing
      acc[year] = scope1 + scope2 + scope3;
      return acc;
    }, {});
  };

  const getLastYear = (data) => {
    return Math.max(...Object.keys(data).map(Number));
  };

  const getLastYearData = (data) => {
    const lastYear = getLastYear(data); // Get the latest year
    return data[lastYear]; // Return the GHG data for the latest year
  };

  return (
    <section className="py-24 ">
      <div className="mx-auto max-w-fit items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        <h3>Environmental</h3>
        <div>
          {
            <OverallGHG
              data={sumGHGByYear(props.data.ghg)}
              name={props.name}
              avg={sumGHGByYear(props.avgdata.ghg)}
              title="Overall GHG Emissions"
            />
          }
        </div>
        <div>
          {
            <ScopeGHG
              data={getLastYearData(props.data.ghg)}
              year={getLastYear(props.data.ghg)}
            />
          }
        </div>
        <div>{<Water />}</div>
      </div>
    </section>
  );
}
