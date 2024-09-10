import type { Metadata } from 'next'
import Link from 'next/link'
import { getPostData, getSortedPostsData } from '@/lib/posts'

const SURROUNDING_POSTS_COUNT = 2; // 현재 포스트 주변에 표시할 포스트 수
const RECENT_POSTS_COUNT = 5; // 최신 포스트 표시 수

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostData(params.slug)
  return {
    title: post.title,
    description: post.title,
    openGraph: {
      title: post.title,
      description: post.title,
      images: post.uploadedImages.length > 0 ? post.uploadedImages : ['/og-image.jpg'],
    },
  }
}

export default async function Post({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug)
  const allPostsData = await getSortedPostsData()

  // 현재 포스트의 인덱스 찾기
  const currentPostIndex = allPostsData.findIndex(post => post.id === params.slug)

  // 주변 포스트 가져오기
  const surroundingPosts = allPostsData.slice(
    Math.max(0, currentPostIndex - SURROUNDING_POSTS_COUNT),
    Math.min(allPostsData.length, currentPostIndex + SURROUNDING_POSTS_COUNT + 1)
  ).filter(post => post.id !== params.slug)

  // 최신 포스트 가져오기 (현재 포스트 제외)
  const recentPosts = allPostsData
    .filter(post => post.id !== params.slug)
    .slice(0, RECENT_POSTS_COUNT)

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{postData.title}</h1>
      <div className="text-gray-800">
        {postData.category && (
          <span>Category: {postData.category}</span>
        )}
      </div>
      <div className="mb-8 text-gray-600">
        <span>{postData.author}</span> • <time>{postData.date}</time>
      </div>
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml! }} />
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {postData.tags.map(tag => (
          <span key={tag} className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* 주변 포스트 목록 */}
      {surroundingPosts && surroundingPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Posts</h2>
          <ul className="space-y-2">
            {surroundingPosts.map(({ id, title }) => (
              <li key={id}>
                <Link href={`/posts/${id}`} className="text-blue-600 hover:underline">
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 최신 포스트 목록 */}
      {recentPosts && recentPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
          <ul className="space-y-2">
            {recentPosts.map(({ id, title }) => (
              <li key={id}>
                <Link href={`/posts/${id}`} className="text-blue-600 hover:underline">
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article >
  )
}