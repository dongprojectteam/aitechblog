import { getSortedPostsData, getTagsWithCount } from '@/lib/posts'
import Pagination from '@/components/Pagination'
import PostCard from '@/components/PostCard'
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
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-semibold mb-2">Tags:</h2>
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
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mt-8">
              {paginatedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
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