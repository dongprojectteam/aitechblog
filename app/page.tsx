import { getSortedPostsData, getTagsWithCount } from '@/lib/posts'
import Pagination from '@/components/Pagination'
import PostListItem from '@/components/PostListItem'
import NoPostsFound from '@/components/NoPostsFound'
import Link from 'next/link'

const POSTS_PER_PAGE = 20

export default async function Home({ searchParams }: { searchParams: { page?: string, q?: string, tag?: string } }) {
  const allPostsData = await getSortedPostsData()
  const tagsWithCount = getTagsWithCount()
  const page = parseInt(searchParams.page || '1')
  const searchQuery = searchParams.q || ''
  const selectedTag = searchParams.tag || ''

  const filteredPosts = allPostsData.filter(post =>
    (searchQuery ? (
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true) &&
    (selectedTag ? post.tags?.includes(selectedTag) : true)
  )

  const totalPosts = filteredPosts.length
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

  const paginatedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Tags:</h2>
        <div className="flex flex-wrap gap-2">
          {selectedTag && (
            <Link
              href={`/?q=${searchQuery}`}
              className="px-3 py-1 rounded-full text-sm bg-red-500 text-white hover:bg-red-600"
            >
              Clear: {selectedTag} ✕
            </Link>
          )}
          {tagsWithCount.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/?tag=${encodeURIComponent(tag)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
              className={`px-3 py-1 rounded-full text-sm ${selectedTag === tag ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {tag} ({count})
            </Link>
          ))}
        </div>
      </div>

      {totalPosts === 0 ? (
        <NoPostsFound searchQuery={searchQuery} />
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {paginatedPosts.map((post) => (
              <li key={post.id} className="py-4">
                <PostListItem post={post} />
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <Pagination currentPage={page} totalPages={totalPages} />
          </div>
        </>
      )}
    </div>
  )
}