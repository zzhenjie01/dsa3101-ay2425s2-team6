// import "./environmentalCard.css";
import { useContext, useState } from "react";
// import { ChatBotContext } from "../context/context";
import { OverallGHG } from "./overallGhg";
import { Water } from "./water";
import { Energy } from "./energy";
import { getLastYear, getLastYearData } from "./helpers/getLastYear";

export default function EnvironmentalCard(props) {
  // Re-format water data to
  // {year:???, water: ???, average: ???}

  const getWaterData = (compdata, avgdata) => {
    const lastYear = getLastYear(compdata);
    return {
      company: props.name,
      water: Math.round(compdata[lastYear]),
      average: avgdata[lastYear] || 0, //if avgdata for that year is unavailable, set average to 0
    };
  };

  // Re-format energy data to
  // {year:???, company: ???, average: ???}

  const getEnergyData = (compdata, avgdata) => {
    return Object.keys(compdata).map((year) => ({
      year: Number(year),
      company: Math.round(compdata[year]),
      average: Math.round(avgdata[year]) || 0, //if avgdata for that year is unavailable, set average to 0
    }));
  };

  return (
    <section className="py-16 ">
      <div className="mx-auto max-w-fit items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        <div className="grid grid-cols-2 gap-4">
          <h3 className="col-span-2 text-xl font-semibold">Environmental</h3>
          <div>
            <OverallGHG
              data={props.data["GHG emissions"]}
              name={props.name}
              avg={props.avgdata["GHG emissions"]}
            />
          </div>
          <div>
            <Water
              data={getWaterData(
                props.data["Water consumption"],
                props.avgdata["Water consumption"]
              )}
              year={getLastYear(props.data["Water consumption"])}
            />
          </div>
          <div className="col-span-2 flex justify-center">
            <Energy
              data={getEnergyData(
                props.data["Electricity consumption"],
                props.avgdata["Electricity consumption"]
              )}
              name={props.name}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
