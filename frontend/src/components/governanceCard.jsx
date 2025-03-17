// import "./governanceCard.css";
import { useContext, useState } from "react";
// import { ChatBotContext } from "../context/contexts";
import { getLastYear, getLastYearData } from "./helpers/getLastYear";
import { BoardGender } from "./boardGender";
import { convertPercentage } from "./helpers/percentage";

export default function GovernanceCard(props) {
  const getBoardGenderData = (compdata, avgdata) => {
    const lastYear = getLastYear(compdata);
    return {
      company: props.name,
      year: lastYear,
      data: [
        {
          gender: "male",
          number: convertPercentage(compdata[lastYear]) || 0,
        },
        {
          gender: "female",
          number: 100 - convertPercentage(compdata[lastYear]) || 0,
        },
      ],
      company_ratio: convertPercentage(compdata[lastYear]) || 0,
      average_ratio: convertPercentage(avgdata[lastYear]) || 0,
    };
  };
  // console.log(props.data["Board of Director gender ratio"]);
  return (
    <section className="py-16 ">
      <div className="mx-auto max-w-fit items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        <div className="grid grid-cols-2 gap-4">
          <h3 className="col-span-2 text-xl font-semibold">Governance</h3>
          <div>
            {
              <BoardGender
                data={getBoardGenderData(
                  props.data["Board of Director gender ratio"],
                  props.avgdata["Board of Director gender ratio"]
                )}
              />
            }
          </div>
        </div>
      </div>
    </section>
  );
}
