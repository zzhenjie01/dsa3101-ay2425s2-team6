import { getLastYear } from "@/components/helpers/getLastYear";
import { BoardGender } from "./boardGender";
import { Corruption } from "./corruption";

export default function GovernanceCard(props) {
  //Get board gender data for the latest year, separated into male and female
  const getBoardGenderData = (compdata, avgdata) => {
    const lastYear = getLastYear(compdata);
    return {
      company: props.name,
      year: lastYear,
      data: [
        {
          gender: "male",
          number: compdata[lastYear] || 0,
        },
        {
          gender: "female",
          number: 100 - compdata[lastYear] || 0, //assume female to be the complementary percentage of male
        },
      ],
      company_ratio: compdata[lastYear] || 0,
      average_ratio: avgdata[lastYear] || 0,
    };
  };

  //Convert company's corruption data to an array with each row containing {year:???, cases:???}
  const transformCorruptionData = (data) => {
    return Object.entries(data)
      .map(([year, cases]) => ({
        year: Number(year), // Convert year to number
        cases,
      }))
      .sort((a, b) => a.year - b.year); //sort by ascending year
  };

  //Get the latest year's corruption data which includes industry average data for comparison
  const getLastYearCorruptionData = (data, avgdata) => {
    // Get the latest year
    const lastYear = getLastYear(data);

    return {
      year: lastYear,
      cases: data[lastYear], // Get cases for the latest year
      avg: avgdata[lastYear], // Get the average for the latest year
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
                  props.data["Board of Director gender ratio"],
                  props.avgdata["Board of Director gender ratio"]
                )}
              />
            }
          </div>
          <div>
            {
              <Corruption
                data={transformCorruptionData(
                  props.data["Number of Corruption cases"]
                )}
                name={props.name}
                lastyeardata={getLastYearCorruptionData(
                  props.data["Number of Corruption cases"],
                  props.avgdata["Number of Corruption cases"]
                )}
              />
            }
          </div>
        </div>
      </div>
    </section>
  );
}
