import "./environmentalCard.css";
import { useContext, useState } from "react";
import { ChatBotContext } from "../context/contexts";
import { OverallGHG } from "./overallGhg";
import { ScopeGHG } from "./scopeGhg";
import { Water } from "./water";
import { Energy } from "./energy";
import { getLastYear, getLastYearData } from "./helpers/getLastYear";

export default function EnvironmentalCard(props) {
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

  // Re-format water data to
  // {year:???, water: ???, average: ???}

  const getWaterData = (compdata, avgdata) => {
    const lastYear = getLastYear(compdata);
    return {
      company: props.name,
      water: compdata[lastYear],
      average: avgdata[lastYear] || 0, //if avgdata for that year is unavailable, set average to 0
    };
  };

  // Re-format energy data to
  // {year:???, company: ???, average: ???}

  const getEnergyData = (compdata, avgdata) => {
    return Object.keys(compdata).map((year) => ({
      year: Number(year),
      company: compdata[year],
      average: avgdata[year] || 0, //if avgdata for that year is unavailable, set average to 0
    }));
  };

  return (
    <section className="py-16 ">
      <div className="mx-auto max-w-fit items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        <div className="grid grid-cols-2 gap-4">
          <h3 className="col-span-2 text-xl font-semibold">Environmental</h3>
          <div>
            {
              <OverallGHG
                data={sumGHGByYear(props.data.ghg)}
                name={props.name}
                avg={sumGHGByYear(props.avgdata.ghg)}
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
          <div>
            {
              <Water
                data={getWaterData(props.data.water, props.avgdata.water)}
                year={getLastYear(props.data.water)}
              />
            }
          </div>
          <div>
            {
              <Energy
                data={getEnergyData(props.data.energy, props.avgdata.energy)}
                name={props.name}
              />
            }
          </div>
        </div>
      </div>
    </section>
  );
}
