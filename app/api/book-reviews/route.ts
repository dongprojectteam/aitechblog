import { NextResponse } from 'next/server';
import { getSortedBookReviewsData, getBookReviewData, createBookReview, updateBookReview, deleteBookReview } from '@/lib/book-reviews';

const REVIEWS_PER_PAGE = 10;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || `${REVIEWS_PER_PAGE}`, 10);
  const id = url.searchParams.get('id');

  if (id) {
    const reviewData = await getBookReviewData(id);
    return NextResponse.json(reviewData);
  }

  const allReviews = await getSortedBookReviewsData()

  const totalPosts = allReviews.length
  const totalPages = Math.ceil(totalPosts / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedReviews = allReviews.slice(startIndex, endIndex)

  return NextResponse.json({
    reviews: paginatedReviews,
    currentPage: page,
    totalPages: totalPages
  })
}

export async function POST(request: Request) {
  const reviewData = await request.json();

  try {
    const fileName = createBookReview(reviewData);
    return NextResponse.json({ message: 'Book review created successfully', fileName }, { status: 201 });
  } catch (error) {
    console.error('Error creating book review:', error);
    return NextResponse.json({ message: 'Failed to create book review' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url)
  const fileName = searchParams.get('fileName')

  if (!fileName) {
    return NextResponse.json(
      { message: 'File name is required' },
      { status: 400 }
    )
  }

  const reviewData = await request.json();

  try {
    updateBookReview(fileName, reviewData);
    return NextResponse.json(
      { message: 'Review updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { message: 'Failed to update Review' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { message: 'Review ID is required' },
      { status: 400 }
    )
  }

  try {
    deleteBookReview(id)
    return NextResponse.json(
      { message: 'Book review deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting book review:', error)
    return NextResponse.json(
      { message: 'Failed to delete book review' },
      { status: 500 }
    )
  }
}