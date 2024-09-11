import Link from 'next/link'
import { FaCalendar, FaUser, FaFolder } from 'react-icons/fa'

interface PostListItemProps {
  post: {
    id: string
    date: string
    title: string
    author: string
    tags?: string[]
    category?: string
  }
}

export default function PostListItem({ post }: PostListItemProps) {
  const { id, date, title, author, tags, category } = post

  return (
    <Link href={`/posts/${id}`} className="block hover:bg-gray-50 transition-colors duration-200">
      <article className="py-6 px-4">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">{title}</h2>
        <div className="flex flex-wrap items-center text-gray-600 text-sm mb-3">
          {category && (
            <span className="flex items-center mr-4 mb-2">
              <FaFolder className="mr-1" />
              {category}
            </span>
          )}
          <span className="flex items-center mr-4 mb-2">
            <FaUser className="mr-1" />
            {author}
          </span>
          <span className="flex items-center mb-2">
            <FaCalendar className="mr-1" />
            {new Date(date).toLocaleDateString()}
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
      </article>
    </Link>
  )
}