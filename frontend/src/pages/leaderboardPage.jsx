import "./leaderboardPage.css";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/context";
import axios from "axios";
import LeaderboardRow from "@/components/leaderboardRow";

export default function LeaderboardPage() {
  const leaderboardData = [
    {
      _id: "1",
      company_name: "ABC",
      e_score: 40,
      s_score: 60,
      g_score: 50,
    },

    {
      _id: "2",
      company_name: "DEF",
      e_score: 36,
      s_score: 28,
      g_score: 41,
    },

    {
      _id: "3",
      company_name: "XYZ",
      e_score: 90,
      s_score: 88,
      g_score: 94,
    },

    {
      _id: "4",
      company_name: "JKL",
      e_score: 63,
      s_score: 57,
      g_score: 72,
    },
  ];

  const { user } = useContext(UserContext);

  const [avgWeight, setAvgWeight] = useState({
    envWeight: -1,
    socWeight: -1,
    govWeight: -1,
  });

  // Effect for API call
  useEffect(() => {
    if (!user) return; // Prevent API call if user is not defined

    axios
      .post("/auth/getAvgWeights", user)
      .then((response) => {
        const { environmentalWeight, socialWeight, governanceWeight } =
          response.data;

        // Convert strings to integers
        const newAvgWeight = {
          envWeight: parseInt(environmentalWeight, 10),
          socWeight: parseInt(socialWeight, 10),
          govWeight: parseInt(governanceWeight, 10),
        };

        // Only update state if the values actually changed
        setAvgWeight((prevWeight) => {
          if (
            prevWeight.envWeight === newAvgWeight.envWeight &&
            prevWeight.socWeight === newAvgWeight.socWeight &&
            prevWeight.govWeight === newAvgWeight.govWeight
          ) {
            return prevWeight; // Avoid unnecessary re-renders
          }
          return newAvgWeight;
        });
      })
      .catch((error) => {
        console.error("Error fetching weights:", error);
      });
  }, [user, avgWeight]); // Effect runs only when user or avgWeight changes

  const [data, setData] = useState(leaderboardData);

  // Effect to update data whenever weights change
  useEffect(() => {
    // Only recalculate when weights change, not when data changes
    const totalWeight =
      avgWeight.envWeight + avgWeight.socWeight + avgWeight.govWeight;

    if (totalWeight === 0) return;

    //Update total to reflect the latest weights and sort by descending total score
    const newData = leaderboardData
      .map((row) => ({
        ...row,
        total: Math.round(
          row.e_score * (avgWeight.envWeight / totalWeight) +
            row.s_score * (avgWeight.socWeight / totalWeight) +
            row.g_score * (avgWeight.govWeight / totalWeight)
        ),
      }))
      .sort((a, b) => b.total - a.total);

    setData(newData);
  }, [avgWeight]); // Only depend on weights

  return (
    <div className="flex-grow pt-20 text-center">
      <h1 className="text-3xl pt-8 pb-16">Leaderboard</h1>
      <div className="flex justify-center items-baseline h-screen">
        <table className="table-fixed">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm font-semibold">
            <tr>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Environmental</th>
              <th className="px-6 py-3">Social</th>
              <th className="px-6 py-3">Governance</th>
              <th className="px-6 py-3">Total Score</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300">
            {data.map((row) => (
              <LeaderboardRow key={row._id} data={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
