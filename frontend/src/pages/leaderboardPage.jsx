import "./leaderboardPage.css";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/context";
import axios from "axios";
import LeaderboardRow from "@/components/leaderboardRow";
import UserRecommendations from "@/components/userRecommendations";
import { parseJsonValues } from "@/components/helpers/parseJson";

import { scoring } from "@/components/helpers/scoring";
import { scoring1 } from "@/components/helpers/scoring1";

export default function LeaderboardPage() {
  scoring1();
  const leaderboardData = scoring();
  // const leaderboardData = [
  //   {
  //     _id: "1",
  //     company: "ABC",
  //     environmentalScore: 40,
  //     socialScore: 60,
  //     governanceScore: 50,
  //   },

  //   {
  //     _id: "2",
  //     company: "DEF",
  //     environmentalScore: 36,
  //     socialScore: 28,
  //     governanceScore: 41,
  //   },

  //   {
  //     _id: "3",
  //     company: "XYZ",
  //     environmentalScore: 90,
  //     socialScore: 88,
  //     governanceScore: 94,
  //   },

  //   {
  //     _id: "4",
  //     company: "JKL",
  //     environmentalScore: 63,
  //     socialScore: 57,
  //     governanceScore: 72,
  //   },
  // ];

  const { user } = useContext(UserContext);

  // data is an array in the format {
  //     _id: "??",
  //     company: "??"",
  //     environmentalScore: ??,
  //     socialScore: ??,
  //     governanceScore: ??,
  //   },
  const [data, setData] = useState(leaderboardData);

  const [weights, setWeights] = useState({
    environmentalWeight: null,
    socialWeight: null,
    governanceWeight: null,
  });

  const [companyTopRecommendations, setCompanyTopRecommendations] = useState(
    []
  );

  // To calculate UserAvgWeights and Top Recommendations for user in initial state
  useEffect(() => {
    const fetchData = async () => {
      try {
        // parallel requests
        const [userAvgWeights, allOtherAvgWeights] = await Promise.all([
          axios.get("/weights/getUserAvgWeights", { params: { user } }),
          axios.get("/weights/getAllOtherAvgWeights", { params: { user } }),
        ]);

        // Convert weights to float using parseJsonValues then set the weights
        setWeights(parseJsonValues(userAvgWeights.data));

        const companyTopRecommendations = await axios.get(
          "/clicks/getUserRecommendations",
          {
            params: {
              userAvgWeights: userAvgWeights.data,
              allOtherAvgWeights: allOtherAvgWeights.data,
            },
          }
        );
        setCompanyTopRecommendations(companyTopRecommendations.data);
      } catch (error) {
        console.error("Data fetching error:", error);
      }
    };

    // Add cleanup function
    const controller = new AbortController();

    fetchData();

    return () => {
      controller.abort(); // Cancel ongoing requests
    };
  }, [user]);

  // Effect to update data whenever weights change
  useEffect(() => {
    // Only recalculate when weights change, not when data changes
    const totalWeight =
      weights.environmentalWeight +
      weights.socialWeight +
      weights.governanceWeight;

    if (totalWeight === 0) return;

    //Update total to reflect the latest weights and sort by descending total score
    const newData = leaderboardData
      .map((row) => ({
        ...row,
        total: Math.round(
          row.environmentalScore * (weights.environmentalWeight / totalWeight) +
            row.socialScore * (weights.socialWeight / totalWeight) +
            row.governanceScore * (weights.governanceWeight / totalWeight)
        ),
      }))
      .sort((a, b) => b.total - a.total);

    setData(newData);
  }, [
    weights.environmentalWeight,
    weights.socialWeight,
    weights.governanceWeight,
  ]); // Only depend on weights

  return (
    <div className="flex-grow pt-20 text-center">
      <h1 className="text-3xl pt-8 pb-16">Leaderboard</h1>
      <div className="flex justify-center items-baseline">
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
      <div className="mt-12">
        <h1 className="text-3xl pb-8">Companies you may be interested in</h1>
        <UserRecommendations companies={companyTopRecommendations} />
      </div>
    </div>
  );
}
