'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaEdit, FaCalendarAlt, FaTrash, FaEye, FaFolder } from 'react-icons/fa';
import PreviewModal from './PreviewModal';
import Pagination from './Pagination';

const POSTS_PER_PAGE = 10;

export default function ContentList({ onPostSelect }: {
  onPostSelect: (post: Post) => void;
}) {
  const [posts, setPosts] = useState<Post[] | []>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page: number) => {
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=${POSTS_PER_PAGE}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        onPostSelect(data)
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  const deletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/posts/?id=${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchPosts(currentPage);
        } else {
          console.error('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  }

  const setPreview = async (content: string) => {
    try {
      const response = await fetch('/api/posts/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewHtml(data.html);
        setShowPreview(true);
      } else {
        console.error('Failed to generate preview');
      }
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  }

  const handlePreview = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        await setPreview(data.content)        
      } else {
        console.error('Failed to fetch post for preview');
      }
    } catch (error) {
      console.error('Error fetching post for preview:', error);
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Content List</h2>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="bg-gray-50 rounded-lg p-4 shadow transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  {new Date(post.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  <FaFolder className="mr-2" />
                  {post.category}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => handlePreview(post.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg transition-colors duration-300 hover:bg-green-600 flex items-center"
                >
                  <FaEye className="mr-2" />
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => fetchPost(post.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg transition-colors duration-300 hover:bg-blue-600 flex items-center"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deletePost(post.id)}
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
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        html={previewHtml}
      />
    </div>
  );
}