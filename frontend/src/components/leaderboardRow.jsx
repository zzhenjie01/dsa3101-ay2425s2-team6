import "./leaderboardRow.css";

export default function LeaderboardRow(props) {
  // console.log(props.data);
  return (
    <div className="flex justify-between items-center bg-gray-100 border border-gray-300 rounded-lg p-3 md:p-5 my-3 mx-auto w-4/5 shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      <span className="pr-8">{props.data.company_name}</span>
      <span>{props.data.e_score}</span>
      <span>{props.data.s_score}</span>
      <span>{props.data.g_score}</span>
      <span>{props.data.total}</span>
    </div>
  );
}
