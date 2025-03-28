import { getLastYear, getLastYearData } from "@/components/helpers/getLastYear";
import { GenderRatio } from "./genderRatio";
import { convertPercentage } from "@/components/helpers/percentage";
import { Turnover } from "./turnover";

export default function SocialCard(props) {
  //Change the gender ratio data to have a percentage for male, and the complement percentage for female
  const transformGenderRatioData = (data) => {
    return Object.entries(data)
      .map(([year, ratio]) => ({
        year: Number(year), // Convert year to number
        male: ratio,
        female: 100 - ratio,
      }))
      .sort((a, b) => a.year - b.year);
  };

  //Get Gender Ratio data for the latest year
  const getLastYearGenderRatioData = (data, avgdata) => {
    // Get the latest year
    const lastYear = getLastYear(data);

    return {
      year: lastYear,
      company: data[lastYear], // Get cases for the latest year
      avg: avgdata[lastYear], // Get the average for the latest year
    };
  };

  //Turnover data to combine company's turnover data with average turnover data per year
  const getTurnoverData = (compdata, avgdata) => {
    return Object.keys(compdata).map((year) => ({
      year: Number(year),
      company: Number.parseFloat(compdata[year]).toFixed(1),
      average: Number.parseFloat(avgdata[year]).toFixed(1) || 0, //if avgdata for that year is unavailable, set average to 0
    }));
  };

  return (
    <section className="py-16 ">
      <div className="mx-auto max-w-fit items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        <div className="grid grid-cols-2 gap-4">
          <h3 className="col-span-2 text-xl font-semibold">Social</h3>
          <div>
            {
              <GenderRatio
                data={transformGenderRatioData(props.data["Gender ratio"])}
                name={props.name}
                lastyeardata={getLastYearGenderRatioData(
                  props.data["Gender ratio"],
                  props.avgdata["Gender ratio"]
                )}
              />
            }
          </div>
          <div>
            {
              <Turnover
                data={getTurnoverData(
                  props.data["Turnover rate"],
                  props.avgdata["Turnover rate"]
                )}
                name={props.name}
              />
            }
          </div>
        </div>
      </div>
    </section>
  );
}
