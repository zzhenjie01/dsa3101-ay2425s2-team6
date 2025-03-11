import "./socialCard.css";
import { useContext, useState } from "react";
import { ChatBotContext } from "../context/contexts";
import { getLastYear, getLastYearData } from "./helpers/getLastYear";

export default function SocialCard(props) {
  // Get total GHG emissions per year in the format
  // ghg: {
  //   2021: ???,
  //   2022: ???,
  //   2023: ???
  // }

  const sumGHGByYear = (ghgData) => {
    return Object.keys(ghgData).reduce((acc, year) => {
      const { scope1 = 0, scope2 = 0, scope3 = 0 } = ghgData[year]; // Default values to 0 if missing
      acc[year] = scope1 + scope2 + scope3;
      return acc;
    }, {});
  };

  // Re-format energy data to
  // {year:???, company: ???, average: ???}

  const getTurnoverData = (compdata, avgdata) => {
    return Object.keys(compdata).map((year) => ({
      year: Number(year),
      company_total: compdata[year].total,
      company_male: compdata[year].male || 0,
      company_female: compdata[year].female || 0,
      average_total: avgdata[year][total] || 0, //if avgdata for that year is unavailable, set average to 0
    }));
  };

  // console.log(getTurnoverData(props.data.turnover, props.avgdata.turnover));

  // console.log(props.data.turnover);

  return (
    <section className="py-16 ">
      <div className="mx-auto max-w-fit items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        <div className="grid grid-cols-2 gap-4">
          <h3 className="col-span-2 text-xl font-semibold">Social</h3>
        </div>
      </div>
    </section>
  );
}
