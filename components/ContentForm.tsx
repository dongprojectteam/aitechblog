'use client';

import { useState, useEffect, useCallback } from 'react';
import categoriesData from '@/data/categories.json';

interface ContentFormProps {
  post: Post | null;
  onUpdate: (() => void) | null;
}

export default function ContentForm({ post = null, onUpdate = null }: ContentFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [privateMessage, setPrivateMessage] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [updated, setUpdated] = useState('');

  const loadDraft = useCallback(async () => {
    try {
      const response = await fetch('/api/drafts?fileName=content_draft.json');
      if (response.ok) {
        const draftData = await response.json();
        setTitle(draftData.title || '');
        setContent(draftData.content || '');
        setTags(draftData.tags || '');
        setCategory(draftData.category || categories[0]);
        setUploadedImages(draftData.uploadedImages || []);
        setPrivateMessage(draftData.privateMessage || '');
        setUpdated(draftData.updated || ''); // 추가된 부분
        console.log('Draft loaded successfully!');
      } else if (response.status === 404) {
        console.log('No draft found');
      } else {
        console.error('Failed to load draft');
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  }, [categories]);

  useEffect(() => {
    setCategories(categoriesData.categories);
    setCategory(categoriesData.categories[0]);

    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setTags(post.tags.join(', '));
      setCategory(post.category);
      setUploadedImages(post.uploadedImages || []);
      setPrivateMessage(post.privateMessage || '');
      setUpdated(post.updated || post.date); // 추가된 부분
    } else {
      loadDraft();
    }
  }, [post, loadDraft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    const now = new Date().toISOString();
    const postData = {
      title,
      content,
      tags: trimmedTags,
      date: post ? post.date : now,
      updated: now, // 추가된 부분
      category,
      uploadedImages,
      privateMessage,
    };

    const url = post ? `/api/posts/?fileName=${post.id || post.slug}.md` : '/api/posts';
    const method = post ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert(post ? 'Post updated successfully!' : 'Post created successfully!');
        if (onUpdate) {
          onUpdate();
        } else {
          resetForm();
        }
      } else {
        const errorData = await response.json();
        console.warn('API Error:', errorData);
        alert(post ? 'Failed to update post' : 'Failed to create post');
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('An error occurred while saving the post');
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags('');
    setCategory(categories[0]);
    setUploadedImages([]);
    setPrivateMessage('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const fullImageUrl = `${window.location.origin}${data.filepath}`;
          setUploadedImages(prev => [...prev, fullImageUrl]);
          const imageMarkdown = `![${file.name}](${fullImageUrl})`;
          setContent(prevContent => prevContent + '\n\n' + imageMarkdown);
        } else {
          alert('Failed to upload image');
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };

  const saveDraft = async () => {
    const draftData = { title, content, tags, category, uploadedImages, privateMessage, updated };
    try {
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: 'content_draft.json',
          content: draftData,
        }),
      });

      if (response.ok) {
        alert('Draft saved successfully!');
      } else {
        alert('Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft');
    }
  };

  const deleteDraft = async () => {
    try {
      const response = await fetch('/api/drafts?fileName=content_draft.json', {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Draft deleted successfully!');
        resetForm();
      } else {
        alert('Failed to delete draft');
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      alert('Error deleting draft');
    }
  };

  const handleImageDelete = async (imageUrl: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const response = await fetch(`/api/deleteImage?url=${encodeURIComponent(imageUrl)}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to delete image:', errorData.message);
          // 에러 발생 시에도 UI에서 이미지 제거
        }
      } catch (error) {
        console.error('Error deleting image:', error);
        // 네트워크 오류 등의 경우에도 UI에서 이미지 제거
      } finally {
        // 성공이든 실패든 상관없이 UI에서 이미지 제거
        setUploadedImages(uploadedImages.filter(url => url !== imageUrl));
      }
    }
  };

  const handlePreview = async () => {
    try {
      const response = await fetch('/api/posts/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      console.log(response)

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
  };

  interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    html: string;
  }

  const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, html }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-3/4 h-3/4 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Preview</h2>
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category:
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="title" className="block mb-2">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        ></textarea>
      </div>
      <div>
        <label htmlFor="tags" className="block mb-2">Tags (comma-separated):</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="image" className="block mb-2">Upload Image:</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="privateMessage" className="block mb-2">Private Message (not public):</label>
        <textarea
          id="privateMessage"
          value={privateMessage}
          onChange={(e) => setPrivateMessage(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        ></textarea>
      </div>
      {uploadedImages.length > 0 && (
        <div>
          <p className="mb-2">Uploaded Images:</p>
          <ul className="list-disc pl-5">
            {uploadedImages.map((image, index) => (
              <li key={index} className="flex items-center justify-between mb-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(image);
                    alert('Image URL copied to clipboard!');
                  }}
                  className="text-blue-500 hover:underline mr-2"
                  type="button"
                >
                  {image}
                </button>
                <button
                  onClick={() => handleImageDelete(image)}
                  className="text-red-500 hover:text-red-700"
                  type="button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={handlePreview}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
        >
          Preview
        </button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          {post ? 'Update Post' : 'Create Post'}
        </button>
        {!post && (
          <>
            <button
              type="button"
              onClick={saveDraft}
              className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={loadDraft}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Load Draft
            </button>
            <button
              type="button"
              onClick={deleteDraft}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Delete Draft
            </button>
          </>
        )}
      </div>
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        html={previewHtml}
      />
    </form>
  );
}