import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/context";
import axios from "axios";
import LeaderboardRow from "@/components/leaderboard/leaderboardRow";
import UserRecommendations from "@/components/leaderboard/UserRecommendations.jsx";
import { parseJsonValues } from "@/components/helpers/parseJson";
import { Suspense, lazy } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function LeaderboardPage() {
  const { user } = useContext(UserContext); // Sets user context

  const [companyData, setCompanyData] = useState(null); // State for company Data
  const [leaderboardData, setLeaderboardData] = useState(null); // State for leaderboard data
  const [loading, setLoading] = useState({
    company: true,
    user: true,
    calculation: true,
  }); // State of fetching data
  const [weights, setWeights] = useState({
    environmentalWeight: null,
    socialWeight: null,
    governanceWeight: null,
  }); // State of our weights
  const [companyTopRecommendations, setCompanyTopRecommendations] = useState(
    []
  ); // State of the top company recommendations

  // leaderboard data extracts the ESG scores for the latest year and is an array in the format {
  //     _id: "??",
  //     company: "??"",
  //     environmentalScore: ??,
  //     socialScore: ??,
  //     governanceScore: ??,
  //   },

  useEffect(() => {
    //get all company's data
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get("/company/getAllCompanyData");
        setCompanyData(response.data); // Store API data in state
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading((prev) => ({
          ...prev,
          company: false,
        }));
      }
    };

    fetchCompanyData();
  }, []);

  useEffect(() => {
    if (!companyData) return;

    //get leaderboard data of latest year to display in the table
    const extractLatestLeaderboard = (companyData) => {
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
          environmentalScore:
            company.leaderboard[latestYear].environmentalScore,
          socialScore: company.leaderboard[latestYear].socialScore,
          governanceScore: company.leaderboard[latestYear].governanceScore,
        }));

      return filteredCompanies;
    };

    setLeaderboardData(extractLatestLeaderboard(companyData));
  }, [companyData]);

  // To calculate UserAvgWeights and Top Recommendations for user in initial state
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // parallel requests
        const [userAvgWeights, allOtherAvgWeights] = await Promise.all([
          axios.get("/weights/getUserAvgWeights", { params: { user } }),
          axios.get("/weights/getAllOtherAvgWeights", { params: { user } }),
        ]);

        // Convert weights to float using parseJsonValues then set the weights
        const parsedWeights = parseJsonValues(userAvgWeights.data);
        setWeights(parsedWeights);

        // get user recommendations using API
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
      } finally {
        setLoading((prev) => ({
          ...prev,
          user: false,
        }));
      }
    };

    fetchData();
  }, [user]);

  // Effect to update data whenever weights change
  useEffect(() => {
    if (!leaderboardData) return;

    //update total score based on user's weights
    const totalWeight =
      weights.environmentalWeight +
      weights.socialWeight +
      weights.governanceWeight;

    //to prevent division by total weight of 0
    if (totalWeight === 0) return;

    //update total score with new weights
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

    setLoading((prev) => ({
      ...prev,
      calculation: false,
    }));
  }, [weights, companyData]); // Only depend on weights or when companyData first loads

  if (loading.company || loading.user || loading.calculation) {
    return <LoadingSpinner />;
  }

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
        {/* Suspense will show the fallback until UserRecommendations is loaded */}
        <Suspense fallback={<p>Loading recommendations...</p>}>
          {leaderboardData && companyTopRecommendations && (
            <UserRecommendations
              companies={companyTopRecommendations}
              cdata={leaderboardData}
              historicalData={companyData}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}
