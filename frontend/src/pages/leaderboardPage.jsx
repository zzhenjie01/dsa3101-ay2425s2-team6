import "./leaderboardPage.css";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/context";
import axios from "axios";
import LeaderboardRow from "@/components/leaderboardRow";
import { Suspense, lazy } from "react";

export default function LeaderboardPage() {
  const leaderboardData = [
    {
      _id: "1",
      company_name: "OCBC",
      e_score: 40,
      s_score: 60,
      g_score: 50,
    },

    {
      _id: "2",
      company_name: "BOQ",
      e_score: 36,
      s_score: 28,
      g_score: 41,
    },

    {
      _id: "3",
      company_name: "ANZ",
      e_score: 90,
      s_score: 88,
      g_score: 94,
    },

    {
      _id: "4",
      company_name: "Woori Bank",
      e_score: 65,
      s_score: 89,
      g_score: 54,
      },
      {
      _id: "5",
      company_name: "Citigroup",
      e_score: 76,
      s_score: 58,
      g_score: 77,
      },

      {
        _id: "6",
        company_name: "KrungThai Bank",
        e_score: 88,
        s_score: 33,
        g_score: 22,
      },
      {
          _id: "7",
          company_name: "HSBC",
          e_score: 65,
          s_score: 85,
          g_score: 82,
      },
      {
          _id: "8",
          company_name: "Banco Santander",
          e_score: 91,
          s_score: 52,
          g_score: 63,
      },
      {
          _id: "9",
          company_name: "CBA",
          e_score: 67,
          s_score: 73,
          g_score: 79,
      },
      {
          _id: "10",
          company_name: "Nubank",
          e_score: 67,
          s_score: 73,
          g_score: 79,
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

        setWeights(userAvgWeights.data);

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

  const UserRecommendations = lazy(() => import("@/components/userRecommendations"));

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
        {/* Suspense will show the fallback until UserRecommendations is loaded */}
        <Suspense fallback={<p>Loading recommendations...</p>}>
                  {/*<UserRecommendations companies={companyTopRecommendations} cdata={leaderboardData} />*/}
                  <UserRecommendations companies={["ANZ", "OCBC", "Banco Santander", "Woori Bank", "BOQ"]} cdata={leaderboardData} />
        </Suspense>
      </div>
    </div>
  );
}
