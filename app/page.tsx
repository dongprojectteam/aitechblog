import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'
import Pagination from '../components/Pagination'
import { FaCalendar, FaUser, FaFolder, FaPencilAlt } from 'react-icons/fa'

const POSTS_PER_PAGE = 20 // 한 페이지당 표시할 포스트 수

export default async function Home({ searchParams }: { searchParams: { page?: string } }) {
  const allPostsData = await getSortedPostsData()
  const page = parseInt(searchParams.page || '1')
  const totalPosts = allPostsData.length
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

  const paginatedPosts = allPostsData.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  )

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {totalPosts === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-xl p-12 text-center">
            <FaPencilAlt className="text-6xl text-blue-500 mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Posts Yet</h2>
            <p className="text-xl text-gray-600 mb-8">
              {`We're working on creating amazing content for you. Check back soon!`}
            </p>
            <div className="w-16 h-1 bg-blue-500 rounded-full mb-8"></div>
            <p className="text-gray-500 italic">
              {`"The best preparation for tomorrow is doing your best today." - H. Jackson Brown Jr.`}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {paginatedPosts.map(({ id, date, title, author, tags, category }) => (
                <Link key={id} href={`/posts/${id}`} className="block transform hover:scale-105 transition-all duration-300">
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
              ))}
            </div>
            <div className="mt-12">
              <Pagination currentPage={page} totalPages={totalPages} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}