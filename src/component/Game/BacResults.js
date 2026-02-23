const BacResults = ({ results }) => {
  if (!results?.summary) return null;

  const ranking = results.summary.ranking || [];
  const categories = Object.entries(results.summary.byCategory || {});

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Resultats Petit Bac</h2>
      <p className="text-sm text-gray-600 mb-4">Lettre: {results.letter}</p>

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Classement</h4>
        <ul className="space-y-2">
          {ranking.map((entry, index) => (
            <li key={entry.userId} className="p-3 bg-gray-50 border rounded flex justify-between">
              <span>{index + 1}. {entry.userName}</span>
              <span className="font-semibold">{entry.score} pts</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        {categories.map(([category, responses]) => (
          <div key={category} className="border rounded p-3">
            <h5 className="font-semibold mb-2">{category}</h5>
            <ul className="space-y-1">
              {responses.map((response) => (
                <li key={`${category}-${response.userId}`} className="text-sm">
                  <span className="font-medium">{response.userName}</span>: {response.response || "-"} ({response.points} pt{response.points > 1 ? "s" : ""})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BacResults;
