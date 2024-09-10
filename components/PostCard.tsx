import Link from 'next/link'
import { FaCalendar, FaUser, FaFolder } from 'react-icons/fa'

interface PostCardProps {
  post: {
    id: string
    date: string
    title: string
    author: string
    tags?: string[]
    category?: string
  }
}

export default function PostCard({ post }: PostCardProps) {
  const { id, date, title, author, tags, category } = post

  return (
    <Link href={`/posts/${id}`} className="block transform hover:scale-105 transition-all duration-300">
      <article className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2">{title}</h2>
          <div className="flex items-center text-gray-600 text-sm mb-3">
            {category && (
              <span className="flex items-center mr-4 line-clamp-1">
                <FaFolder className="mr-1" />
                {category}
              </span>
            )}
            <span className="flex items-center mr-4 line-clamp-1">
              <FaUser className="mr-1" />
              {author}
            </span>
            <span className="flex items-center line-clamp-1">
              <FaCalendar className="mr-1" />
              {date}
            </span>
          </div>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}