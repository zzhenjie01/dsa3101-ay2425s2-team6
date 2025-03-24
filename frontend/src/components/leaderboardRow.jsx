import "./leaderboardRow.css";

export default function LeaderboardRow(props) {
  return (
    <tr className="bg-white hover:bg-gray-100">
      <td className="px-6 py-4">{props.data.company}</td>
      <td className="px-6 py-4">{Math.round(props.data.environmentalScore)}</td>
      <td className="px-6 py-4">{Math.round(props.data.socialScore)}</td>
      <td className="px-6 py-4">{Math.round(props.data.governanceScore)}</td>
      <td className="px-6 py-4">{Math.round(props.data.total)}</td>
    </tr>
  );
}
