export default function UserRecommendations({ companies }) {
  return (
    <ul>
      {companies.map((company, index) => (
        <li key={index}>{company}</li>
      ))}
    </ul>
  );
}
