import "./leaderboardPage.css";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/context";
import axios from "axios";
import LeaderboardRow from "@/components/leaderboardRow";
import UserRecommendations from "@/components/userRecommendations";
import { parseJsonValues } from "@/components/helpers/parseJson";

export default function LeaderboardPage() {
  const { user } = useContext(UserContext);

  const [companyData, setCompanyData] = useState(null);

  // leaderboard data extracts the ESG scores for the latest year and is an array in the format {
  //     _id: "??",
  //     company: "??"",
  //     environmentalScore: ??,
  //     socialScore: ??,
  //     governanceScore: ??,
  //   },
  const [leaderboardData, setLeaderboardData] = useState(null);

  //get all company's data
  const fetchCompanyData = async () => {
    try {
      const response = await axios.get("/company/getAllCompanyData");
      setCompanyData(response.data); // Store API data in state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  //get leaderboard data of latest year to display in the table
  function extractLatestLeaderboard(companyData) {
    if (companyData === null) return;
    // Identify the latest year available across all companies
    const latestYear = Math.max(
      ...companyData
        .map((company) => Object.keys(company.leaderboard || {}).map(Number))
        .flat()
    );

    // Filter companies that have leaderboard data for the latest year
    let filteredCompanies = companyData
      .filter(
        (company) => company.leaderboard && company.leaderboard[latestYear]
      )
      .map((company) => ({
        _id: company.idx,
        company: company.name,
        environmentalScore: company.leaderboard[latestYear].environmentalScore,
        socialScore: company.leaderboard[latestYear].socialScore,
        governanceScore: company.leaderboard[latestYear].governanceScore,
      }));

    return filteredCompanies;
  }

  useEffect(() => {
    setLeaderboardData(extractLatestLeaderboard(companyData));
  }, [companyData]);

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

  //update total score based on user's weights
  const updateTotalScore = () => {
    const totalWeight =
      weights.environmentalWeight +
      weights.socialWeight +
      weights.governanceWeight;

    //to prevent division by total weight of 0
    if (totalWeight === 0) return;

    //update total score with new weights
    if (leaderboardData) {
      setLeaderboardData((prevData) =>
        prevData
          .map((row) => ({
            ...row,
            total: Math.round(
              row.environmentalScore *
                (weights.environmentalWeight / totalWeight) +
                row.socialScore * (weights.socialWeight / totalWeight) +
                row.governanceScore * (weights.governanceWeight / totalWeight)
            ),
          }))
          .sort((a, b) => b.total - a.total)
      );
    }
  };

  // Effect to update data whenever weights change
  useEffect(() => {
    updateTotalScore();
  }, [
    weights.environmentalWeight,
    weights.socialWeight,
    weights.governanceWeight,
    companyData,
  ]); // Only depend on weights or when companyData first loads

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
            {leaderboardData &&
              leaderboardData.map((row) => (
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
