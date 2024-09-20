import AILinkCard from '@/components/AILinkCard';
import aiSitesData from '@/data/aiSites.json';

export default function Home() {
  const { aiSites } = aiSitesData;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {aiSites.map((category) => (
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