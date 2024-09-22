'use client';

import { useState, useEffect } from 'react';
import AILinkCard from '@/components/AILinkCard';
import { incrementVisits } from '@/lib/incrementVisits';

interface AISite {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

interface AISiteCategory {
  category: string;
  sites: AISite[];
}

interface AISitesData {
  aiSites: AISiteCategory[];
}

export default function Home() {
  const [aiSitesData, setAiSitesData] = useState<AISitesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAiSites = async () => {
      try {
        const response = await fetch('/api/aiSites');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAiSitesData(data);
      } catch (e) {
        setError('Failed to load AI sites data');
        console.error('Error fetching AI sites:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAiSites();
    incrementVisits('/diff')
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!aiSitesData) return <div>No data available</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {aiSitesData.aiSites.map((category) => (
        <div key={category.category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.sites.map((site) => (
              <AILinkCard key={site.title} {...site} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}