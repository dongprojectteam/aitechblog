import { NextResponse } from 'next/server'
import {
  getSortedPostsData,
  getPostData,
  createPost,
  updatePost,
  deletePost
} from '@/lib/posts'

const POSTS_PER_PAGE = 10

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || POSTS_PER_PAGE
  const id = searchParams.get('id')

  if (id) {
    const postData = await getPostData(id)
    return NextResponse.json(postData)
  }

  const allPosts = getSortedPostsData()

  const totalPosts = allPosts.length
  const totalPages = Math.ceil(totalPosts / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedPosts = allPosts.slice(startIndex, endIndex)

  return NextResponse.json({
    posts: paginatedPosts,
    currentPage: page,
    totalPages: totalPages,
  })
}

export async function POST(request: Request) {
  const postData = await request.json()

  try {
    const fileName = createPost(postData)
    return NextResponse.json(
      { message: 'Post created successfully', fileName },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { message: 'Failed to create post' },
      { status: 500 }
    )
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

  const postData = await request.json()

  try {
    updatePost(fileName, postData)
    return NextResponse.json(
      { message: 'Post updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { message: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { message: 'Post ID is required' },
      { status: 400 }
    )
  }

  try {
    deletePost(id)
    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { message: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
