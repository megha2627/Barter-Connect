export default function MatchCard({ match }) {
  return (
    <div className="p-4 border rounded bg-gray-100">
      <h3 className="text-lg font-bold">{match.title}</h3>
      <p>{match.description}</p>
      <p>Category: {match.category}</p>
      <p>Offered by: {match.user_name}</p>
      <button className="mt-2 bg-blue-500 text-white p-2 rounded">
        Propose Barter
      </button>
    </div>
  );
}
