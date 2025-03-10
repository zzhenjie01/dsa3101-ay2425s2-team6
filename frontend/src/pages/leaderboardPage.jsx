import "./leaderboardPage.css";
import { useState, useEffect } from "react";
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

  const [data, setData] = useState([]);
  useEffect(() => {
    setData(leaderboardData);
  }, []);

  const { e_weight, s_weight, g_weight } = 1;

  return (
    <div className="flex-grow pt-20 text-center">
      <h1 className="text-3xl pt-8 pb-16">Leaderboard</h1>
      <div className="flex justify-between items-center bg-white border border-gray-300 rounded-lg p-3 md:p-5 my-3 mx-auto w-4/5 shadow-md text-lg font-semibold">
        <span>Company</span>
        <span>Environmental</span>
        <span>Social</span>
        <span>Governance</span>
        <span>Total Score</span>
      </div>
      {data.map((row) => (
        <LeaderboardRow
          key={row._id}
          data={{ ...row, total: row.e_score + row.s_score + row.g_score }}
        />
      ))}
    </div>
  );
}
