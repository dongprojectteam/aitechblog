import { getSortedPostsData, getTagsWithCount } from '@/lib/posts'
import Pagination from '@/components/Pagination'
import PostListItem from '@/components/PostListItem'
import NoPostsFound from '@/components/NoPostsFound'
import Link from 'next/link'

const POSTS_PER_PAGE = 20
const TOP_TAGS_COUNT = 10


function getCategoriesWithCount(posts: Post[]): { category: string; count: number }[] {
  const categories = posts.reduce((acc: { [key: string]: number }, post) => {
    if (post.category && post.category !== 'Private') {
      acc[post.category] = (acc[post.category] || 0) + 1;
    }
    return acc;
  }, {});

  return Object.entries(categories)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export default async function Home({ searchParams }: { searchParams: { page?: string, q?: string, tag?: string, category?: string, showAllTags?: string } }) {
  const allPostsData: Post[] = await getSortedPostsData()
  const tagsWithCount = getTagsWithCount()
  const categoriesWithCount = getCategoriesWithCount(allPostsData)
  const page = parseInt(searchParams.page || '1')
  const searchQuery = searchParams.q || ''
  const selectedTag = searchParams.tag || ''
  const selectedCategory = searchParams.category || ''
  const showAllTags = searchParams.showAllTags === 'true'

  const topTags = tagsWithCount.slice(0, TOP_TAGS_COUNT)
  const remainingTags = tagsWithCount.slice(TOP_TAGS_COUNT)

  const filteredPosts = allPostsData.filter(post =>
    post.category !== 'Private' &&
    (searchQuery ? (
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true) &&
    (selectedTag ? post.tags?.includes(selectedTag) : true) &&
    (selectedCategory ? post.category === selectedCategory : true)
  )

  const totalPosts = filteredPosts.length
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

  const paginatedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  )

  const toggleUrl = new URLSearchParams(searchParams);
  toggleUrl.set('showAllTags', (!showAllTags).toString());
  if (searchQuery) toggleUrl.set('q', searchQuery)
  if (selectedTag) toggleUrl.set('tag', selectedTag)
  if (selectedCategory) toggleUrl.set('category', selectedCategory)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col lg:flex-row">
      {/* 사이드바 (모바일에서는 상단에 위치) */}
      <aside className="w-full lg:w-1/4 lg:pr-4 mb-8 lg:mb-0">
        <div className="sticky top-4">
          <h2 className="text-xl font-semibold mb-4">Categories:</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategory && (
              <Link
                href={`/?q=${searchQuery}${selectedTag ? `&tag=${selectedTag}` : ''}`}
                className="px-3 py-1 rounded-full text-sm bg-red-500 text-white hover:bg-red-600 transition duration-300"
              >
                Clear: {selectedCategory} ✕
              </Link>
            )}
            {categoriesWithCount.map(({ category, count }) => (
              <Link
                key={category}
                href={`/?category=${encodeURIComponent(category)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}${selectedTag ? `&tag=${selectedTag}` : ''}`}
                className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition duration-300`}
              >
                {category} ({count})
              </Link>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">Tags:</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTag && (
              <Link
                href={`/?q=${searchQuery}${selectedCategory ? `&category=${selectedCategory}` : ''}`}
                className="px-3 py-1 rounded-full text-sm bg-red-500 text-white hover:bg-red-600 transition duration-300"
              >
                Clear: {selectedTag} ✕
              </Link>
            )}
            {topTags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/?tag=${encodeURIComponent(tag)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}${selectedCategory ? `&category=${selectedCategory}` : ''}`}
                className={`px-3 py-1 rounded-full text-sm ${selectedTag === tag
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition duration-300`}
              >
                {tag} ({count})
              </Link>
            ))}
            {showAllTags && remainingTags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/?tag=${encodeURIComponent(tag)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}${selectedCategory ? `&category=${selectedCategory}` : ''}`}
                className={`px-3 py-1 rounded-full text-sm ${selectedTag === tag
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition duration-300`}
              >
                {tag} ({count})
              </Link>
            ))}
          </div>
          {remainingTags.length > 0 && (
            <Link
              href={`/?${toggleUrl.toString()}`}
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 text-sm font-medium"
            >
              {showAllTags ? (
                <>
                  <span>Show less</span>
                  <span className="ml-2">↑</span>
                </>
              ) : (
                <>
                  <span>Show more</span>
                  <span className="ml-2">↓</span>
                </>
              )}
              <span className="ml-1">({remainingTags.length})</span>
            </Link>
          )}
        </div>
      </aside>

      {/* 포스트 목록 */}
      <main className="w-full lg:w-3/4">
        {/* 선택된 필터 표시 */}
        {(selectedCategory || selectedTag || searchQuery) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="px-3 py-1 rounded-full text-sm bg-green-500 text-white">
                Category: {selectedCategory}
              </span>
            )}
            {selectedTag && (
              <span className="px-3 py-1 rounded-full text-sm bg-blue-500 text-white">
                Tag: {selectedTag}
              </span>
            )}
            {searchQuery && (
              <span className="px-3 py-1 rounded-full text-sm bg-purple-500 text-white">
                Search: {searchQuery}
              </span>
            )}
          </div>
        )}

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
      </main>
    </div>
  )
}