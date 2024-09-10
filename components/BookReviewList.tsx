'use client';

import { useState, useEffect } from 'react';
import Pagination from './Pagination';
import { useSearchParams } from 'next/navigation';
import { FaEdit, FaBook, FaStar, FaTrash } from 'react-icons/fa';

const REVIEWS_PER_PAGE = 10; // Adjust as needed

export default function BookReviewList({ onReviewSelect }: {
  onReviewSelect: (review: BookReview) => void;
}) {
  const [reviews, setReviews] = useState<[] | BookReview[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage]);

  const fetchReviews = async (page: number) => {
    try {
      const response = await fetch(`/api/book-reviews?page=${page}&limit=${REVIEWS_PER_PAGE}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setTotalPages(data.totalPages);
      } else {
        console.error('Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchReview = async (id: string) => {
    try {
      const response = await fetch(`/api/book-reviews/?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        onReviewSelect(data)
      } else {
        console.error('Failed to fetch review');
      }
    } catch (error) {
      console.error('Error fetching review:', error);
    }
  }

  const deleteReview = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await fetch(`/api/book-reviews/?id=${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Refresh the review list after deletion
          fetchReviews(currentPage);
        } else {
          console.error('Failed to delete review');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <FaBook className="mr-2" />
        Book Review List
      </h2>
      <ul className="space-y-4">
        {reviews.map((review) => (
          <li key={review.id} className="bg-gray-50 rounded-lg p-4 shadow transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{review.title}</h3>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <FaBook className="mr-2" />
                  {review.author}
                </p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchReview(review.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg transition-colors duration-300 hover:bg-green-600 flex items-center"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => deleteReview(review.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg transition-colors duration-300 hover:bg-red-600 flex items-center"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}