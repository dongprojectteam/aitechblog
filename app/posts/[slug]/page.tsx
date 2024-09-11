import type { Metadata } from 'next'
import Link from 'next/link'
import { getPostData, getSortedPostsData } from '@/lib/posts'

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

  const currentPostIndex = allPostsData.findIndex(post => post.id === params.slug)
  const previousPost = currentPostIndex > 0 ? allPostsData[currentPostIndex - 1] : null
  const nextPost = currentPostIndex < allPostsData.length - 1 ? allPostsData[currentPostIndex + 1] : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row">
      {/* 사이드바 (PC 화면) */}
      <aside className="lg:w-1/4 lg:pr-8 mb-8 lg:mb-0 bg-gray-50 p-6 rounded-lg shadow-md">
        <div className="flex flex-col">
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-8">
              {postData.tags.map(tag => (
                <span key={tag} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <hr className="my-2 border-gray-300" />
            <div className="space-y-4">
              {previousPost && (
                <Link href={`/posts/${previousPost.id}`} className="block text-blue-600 hover:underline">
                  ← Previous: {previousPost.title}
                </Link>
              )}
              {nextPost && (
                <Link href={`/posts/${nextPost.id}`} className="block text-blue-600 hover:underline">
                  Next: {nextPost.title} →
                </Link>
              )}
              <Link href="/" className="block text-blue-600 hover:underline">
                ← Back to List
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <article className="lg:w-3/4 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{postData.title}</h1>
        <div className="text-gray-800 mb-4">
          {postData.category && (
            <span className="font-semibold">Category: {postData.category}</span>
          )}
        </div>
        <div className="mb-8 text-gray-600">
          <span>{postData.author}</span> • <time>{postData.date}</time>
        </div>
        <div className="prose prose-lg max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml! }} />
        </div>

        {/* 모바일 화면용 네비게이션 */}
        <div className="mt-12 lg:hidden">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Tags</h2>
            <hr className="my-2 border-gray-300" />
            <div className="flex flex-wrap gap-2 mb-8">
              {postData.tags.map(tag => (
                <span key={tag} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold">Navigation</h2>
            <hr className="my-2 border-gray-300" />
            <div className="space-y-4">
              {previousPost && (
                <Link href={`/posts/${previousPost.id}`} className="block text-blue-600 hover:underline">
                  ← Previous: {previousPost.title}
                </Link>
              )}
              {nextPost && (
                <Link href={`/posts/${nextPost.id}`} className="block text-blue-600 hover:underline">
                  Next: {nextPost.title} →
                </Link>
              )}
              <Link href="/" className="block text-blue-600 hover:underline">
                ← Back to List
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}