'use client';

interface VisitStats {
  [page: string]: number;
}

interface StatsFormProps {
  stats: VisitStats | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export default function StatsForm({ stats, isLoading, error, onRefresh }: StatsFormProps) {
  if (isLoading) return <div>Loading statistics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No statistics available</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Page Visit Statistics</h1>
      <button 
        onClick={onRefresh}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh Stats
      </button>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Page</th>
            <th className="border border-gray-300 p-2">Visits</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(stats).map(([page, visits]) => (
            <tr key={page}>
              <td className="border border-gray-300 p-2">{page}</td>
              <td className="border border-gray-300 p-2 text-center">{visits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}