import "./environmentalCard.css";
import { useContext, useState } from "react";
import { ChatBotContext } from "../context/contexts";
import { LineChartMultiple } from "./lineChartMultiple";

export default function EnvironmentalCard(props) {
  const sumGHGByYear = (ghgData) => {
    return Object.keys(ghgData).reduce((acc, year) => {
      const { scope1 = 0, scope2 = 0, scope3 = 0 } = ghgData[year]; // Default values to 0 if missing
      acc[year] = scope1 + scope2 + scope3;
      return acc;
    }, {});
  };

  return (
    <section className="py-24 ">
      <div className="mx-auto flex max-w-fit items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        <h3>Environmental</h3>
        {
          <LineChartMultiple
            data={sumGHGByYear(props.data.ghg)}
            name={props.name}
            avg={sumGHGByYear(props.avgdata.ghg)}
            title="Overall GHG Emissions"
          />
        }
      </div>
    </section>
  );
}
