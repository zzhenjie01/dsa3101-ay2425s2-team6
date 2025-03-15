import "./leaderboardRow.css";

export default function LeaderboardRow(props) {
  // console.log(props.data);
  return (
    <tr className="bg-white hover:bg-gray-100">
      <td className="px-6 py-4">{props.data.company_name}</td>
      <td className="px-6 py-4">{props.data.e_score}</td>
      <td className="px-6 py-4">{props.data.s_score}</td>
      <td className="px-6 py-4">{props.data.g_score}</td>
      <td className="px-6 py-4">{props.data.total}</td>
    </tr>
  );
}
