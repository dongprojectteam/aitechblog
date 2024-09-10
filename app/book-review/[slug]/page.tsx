import Link from 'next/link'
import Image from 'next/image'
import { getBookReviewData, getSortedBookReviewsData } from '../../../lib/book-reviews'

const SURROUNDING_REVIEWS_COUNT = 2;
const RECENT_REVIEWS_COUNT = 5;

export default async function BookReview({ params }: { params: { slug: string } }) {
  const reviewData = await getBookReviewData(params.slug)
  const allReviewsData = await getSortedBookReviewsData()

  const currentReviewIndex = allReviewsData.findIndex(review => review.id === params.slug)

  const surroundingReviews = allReviewsData.slice(
    Math.max(0, currentReviewIndex - SURROUNDING_REVIEWS_COUNT),
    Math.min(allReviewsData.length, currentReviewIndex + SURROUNDING_REVIEWS_COUNT + 1)
  ).filter(review => review.id !== params.slug)

  const recentReviews = allReviewsData
    .filter(review => review.id !== params.slug)
    .slice(0, RECENT_REVIEWS_COUNT)

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
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
      <div className="text-gray-800 mb-2">
        <span>Author: {reviewData.author}</span>
      </div>
      <div className="mb-4 flex items-center">
        <span className="text-yellow-500 mr-1">★</span>
        <span>{reviewData.rating.toFixed(1)}</span>
      </div>
      <div className="mb-8 text-gray-600">
        <span>{reviewData.reviewer}</span> • <time>{reviewData.date}</time>
      </div>
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: reviewData.contentHtml }} />
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {reviewData.tags.map(tag => (
          <span key={tag} className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* 주변 리뷰 목록 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Book Reviews</h2>
        <ul className="space-y-2">
          {surroundingReviews.map(({ id, title }) => (
            <li key={id}>
              <Link href={`/book-review/${id}`} className="text-blue-600 hover:underline">
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 최신 리뷰 목록 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Recent Book Reviews</h2>
        <ul className="space-y-2">
          {recentReviews.map(({ id, title }) => (
            <li key={id}>
              <Link href={`/book-review/${id}`} className="text-blue-600 hover:underline">
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}