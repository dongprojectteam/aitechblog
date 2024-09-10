import { getSortedPostsData } from '../lib/posts'
import Pagination from '../components/Pagination'
import SearchForm from '../components/SearchForm'
import PostCard from '../components/PostCard'
import NoPostsFound from '../components/NoPostsFound'

const POSTS_PER_PAGE = 20 // 한 페이지당 표시할 포스트 수

export default async function Home({ searchParams }: { searchParams: { page?: string, q?: string } }) {
  const allPostsData = await getSortedPostsData()
  const page = parseInt(searchParams.page || '1')
  const searchQuery = searchParams.q || ''

  const filteredPosts = searchQuery
    ? allPostsData.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : allPostsData

  const totalPosts = filteredPosts.length
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

  const paginatedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  )

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <SearchForm initialQuery={searchQuery} />

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