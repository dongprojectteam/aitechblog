// components/AILinkCard.tsx
interface AILinkCardProps {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

const AILinkCard: React.FC<AILinkCardProps> = ({ title, description, url, imageUrl }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <img src={imageUrl} alt={title} className="w-full h-32 object-cover rounded-t-lg" />
      <h3 className="text-xl font-bold mt-2">{title}</h3>
      <p className="text-gray-600 mt-1">{description}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 inline-block">
        Visit Site
      </a>
    </div>
  );
};

export default AILinkCard;