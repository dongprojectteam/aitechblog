import Link from 'next/link'
import Image from 'next/image'
import { getBookReviewData, getSortedBookReviewsData } from '@/lib/book-reviews'
import { incrementVisits } from '@/lib/incrementVisits';
import { FaCalendar, FaEdit } from 'react-icons/fa';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function BookReview({ params }: { params: { slug: string } }) {
  await incrementVisits(`/posts/${params.slug}`);


  const reviewData = await getBookReviewData(params.slug)
  const allReviewsData = await getSortedBookReviewsData()

  const currentReviewIndex = allReviewsData.findIndex(review => review.id === params.slug)
  const previousReview = currentReviewIndex > 0 ? allReviewsData[currentReviewIndex - 1] : null
  const nextReview = currentReviewIndex < allReviewsData.length - 1 ? allReviewsData[currentReviewIndex + 1] : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row">
      {/* 사이드바 (PC 화면) */}
      <aside className="lg:w-1/4 lg:pr-8 mb-8 lg:mb-0 bg-gray-50 p-6 rounded-lg shadow-md">
        <div className="mb-4">

          <div className="flex flex-wrap gap-2 mb-8">
            {reviewData.tags.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <hr className="my-2 border-gray-300" />
          <div className="space-y-4">
            {previousReview && (
              <Link href={`/book-review/${previousReview.id}`} className="block text-blue-600 hover:underline">
                ← Previous: {previousReview.title}
              </Link>
            )}
            {nextReview && (
              <Link href={`/book-review/${nextReview.id}`} className="block text-blue-600 hover:underline">
                Next: {nextReview.title} →
              </Link>
            )}
            <Link href="/book-review" className="block text-blue-600 hover:underline">
              ← Back to Reviews
            </Link>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <article className="lg:w-3/4 bg-white p-6 rounded-lg shadow-md">
        <div className="relative h-64 mb-8 bg-gray-200 rounded-lg overflow-hidden">
          {reviewData.coverImage ? (
            <Image
              src={reviewData.coverImage}
              alt={`Cover of ${reviewData.title}`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{reviewData.title}</h1>
        <div className="mb-8 text-gray-600">
          <span>{reviewData.reviewer}</span> •
          <span className="flex items-center inline-block">
            <FaCalendar className="mr-1" />
            <time>{formatDate(reviewData.date)}</time>
          </span>
          {reviewData.updated && reviewData.updated !== reviewData.date && (
            <span className="flex items-center inline-block ml-4">
              <FaEdit className="mr-1" />
              <time>Updated: {formatDate(reviewData.updated)}</time>
            </span>
          )}
        </div>
        <div className="prose prose-lg max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: reviewData.contentHtml }} />
        </div>

        {/* 모바일 화면용 저자 및 평점 */}
        <div className="mt-8 lg:hidden">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Author</h2>
            <span className="text-gray-800">{reviewData.author}</span>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Rating</h2>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{reviewData.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}