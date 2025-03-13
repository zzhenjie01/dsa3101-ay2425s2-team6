// import "./governanceCard.css";
import { useContext, useState } from "react";
// import { ChatBotContext } from "../context/contexts";
import { getLastYear, getLastYearData } from "./helpers/getLastYear";
import { BoardGender } from "./boardGender";

export default function GovernanceCard(props) {
  //Board gender data will have:
  // company, name,
  // data array of size 2, male and female, which comprises of gender, number (normalised to 100),
  // company ratio, average ratio (no. of female / no. of male)
  const getBoardGenderData = (compdata, avgdata) => {
    const lastYear = getLastYear(compdata);
    return {
      company: props.name,
      year: lastYear,
      data: [
        {
          gender: "male",
          number:
            Math.round(
              (compdata[lastYear]?.male * 100) /
                (compdata[lastYear]?.male + compdata[lastYear]?.female)
            ) || 0,
        },
        {
          gender: "female",
          number:
            Math.round(
              (compdata[lastYear]?.female * 100) /
                (compdata[lastYear]?.male + compdata[lastYear]?.female)
            ) || 0,
        },
      ],
      company_ratio: compdata[lastYear].female / compdata[lastYear].male || 0,
      average_ratio: avgdata[lastYear].female / avgdata[lastYear].male || 0,
    };
  };

  return (
    <section className="py-16 ">
      <div className="mx-auto max-w-fit items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        <div className="grid grid-cols-2 gap-4">
          <h3 className="col-span-2 text-xl font-semibold">Governance</h3>
          <div>
            {
              <BoardGender
                data={getBoardGenderData(
                  props.data.board_gender,
                  props.avgdata.board_gender
                )}
              />
            }
          </div>
        </div>
      </div>
    </section>
  );
}
