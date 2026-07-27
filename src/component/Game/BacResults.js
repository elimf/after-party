const BacResults = ({ results }) => {
  if (!results?.summary) return null;

  const ranking = results.summary.ranking || [];
  const categories = Object.entries(results.summary.byCategory || {});

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Résultats Petit Bac</h2>
      <p className="text-sm text-gray-700 mb-4">Lettre: <span className="font-semibold">{results.letter}</span></p>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Classement</h4>
        <ul className="space-y-2">
          {ranking.map((entry, index) => (
            <li key={entry.userId} className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center hover:shadow-sm transition">
              <span className="text-gray-900"><span className="font-bold text-purple-600">{index + 1}.</span> {entry.userName}</span>
              <span className="font-semibold text-gray-900">{entry.score} pts</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        {categories.map(([category, responses]) => (
          <div key={category} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h5 className="font-semibold text-gray-900 mb-3 capitalize">{category}</h5>
            <ul className="space-y-2">
              {responses.map((response) => (
                <li key={`${category}-${response.userId}`} className="text-sm text-gray-700 p-2 bg-white rounded border border-gray-100">
                  <span className="font-semibold text-gray-900">{response.userName}</span>: {response.response || "-"} <span className="text-purple-600 font-semibold">({response.points} pt{response.points > 1 ? "s" : ""})</span>
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
