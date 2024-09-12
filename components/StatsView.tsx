'use client';

import { useState, useEffect } from 'react';

interface VisitStats {
  [page: string]: number;
}

export default function StatsView() {
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/getVisits');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        if (data.success) {
          setStats(data.visits);
        } else {
          throw new Error(data.error || 'Unknown error occurred');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No stats available</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Page Visit Statistics</h1>
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