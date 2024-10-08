import Link from 'next/link';
import Image from 'next/image';
import { getSortedBookReviewsData } from '@/lib/book-reviews';
import Pagination from '@/components/Pagination';
import { FaStar, FaCalendar, FaUser, FaBook, FaEdit } from 'react-icons/fa';

const ITEMS_PER_PAGE = 9;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function BookReviewsPage({
  searchParams,
}: {
  searchParams: { page: string; q?: string };
}) {

  const allBookReviews = await getSortedBookReviewsData();
  const page = parseInt(searchParams.page || '1', 10);
  const searchQuery = searchParams.q || '';

  // 검색 쿼리에 따라 책 리뷰 필터링
  const filteredReviews = allBookReviews.filter((review) =>
    searchQuery
      ? review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  );

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);

  const bookReviews = filteredReviews.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {filteredReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-xl p-12 text-center">
          <FaBook className="text-6xl text-purple-500 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {searchQuery ? 'No Reviews Found' : 'Currently Reading'}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {searchQuery
              ? `We couldn't find any reviews matching "${searchQuery}". Try a different search term.`
              : `We're busy diving into some great books! Check back soon for reviews.`}
          </p>
          <div className="w-16 h-1 bg-purple-500 rounded-full mb-8"></div>
          <p className="text-gray-500 italic">
            {`"A reader lives a thousand lives before he dies. The man who never reads lives only one." - George R.R. Martin`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bookReviews.map((review) => (
              <Link key={review.id} href={`/book-review/${review.id}`} className="transform hover:scale-105 transition-all duration-300">
                <article className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl">
                  <div className="relative h-56 bg-gray-200">
                    {review.coverImage ? (
                      <Image
                        src={review.coverImage}
                        alt={`Cover of ${review.title}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-opacity duration-300 ease-in-out hover:opacity-75"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2 hover:text-purple-600 transition-colors duration-200">
                      {review.title}
                    </h2>
                    <p className="text-gray-600 mb-2 flex items-center">
                      <FaUser className="mr-2" />
                      <span className="line-clamp-1">{review.author}</span>
                    </p>
                    <div className="flex items-center mb-2 text-yellow-500">
                      <FaStar className="mr-1" />
                      <span>{review.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-sm text-gray-500 flex flex-col">
                      <span className="flex items-center">
                        <FaCalendar className="mr-2" />
                        {formatDate(review.date)}
                      </span>
                      {review.updated && review.updated !== review.date && (
                        <span className="flex items-center mt-1">
                          <FaEdit className="mr-2" />
                          Updated: {formatDate(review.updated)}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          <div className="mt-12">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
            />
          </div>
        </>
      )}
    </div>
  );
}