'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['Generative AI'];

export default function ContentForm({ post = null, onUpdate = null }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [privateMessage, setPrivateMessage] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setTags(post.tags.join(', '));
      setCategory(post.category);
      setUploadedImages(post.uploadedImages || []);
      setPrivateMessage(post.privateMessage || '');
    } else {
      loadDraft();
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    const postData = {
      title,
      content,
      tags: trimmedTags,
      date: new Date().toISOString(),
      category,
      uploadedImages,
      privateMessage,
    };

    const url = post ? `/api/posts/?fileName=${post.id || post.slug}.md` : '/api/posts';
    const method = post ? 'PUT' : 'POST';

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
        setTitle('');
        setContent('');
        setTags('');
        setCategory(CATEGORIES[0]);
        setUploadedImages([]);
        setPrivateMessage('');
      }
    } else {
      console.warn(response)
      alert(post ? 'Failed to update post' : 'Failed to create post');
    }
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
        }
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };

  const saveDraft = async () => {
    const draftData = { title, content, tags, category, uploadedImages, privateMessage };
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

  const loadDraft = async () => {
    try {
      const response = await fetch('/api/drafts?fileName=content_draft.json');
      if (response.ok) {
        const draftData = await response.json();
        setTitle(draftData.title || '');
        setContent(draftData.content || '');
        setTags(draftData.tags || '');
        setCategory(draftData.category || CATEGORIES[0]);
        setUploadedImages(draftData.uploadedImages || []);
        setPrivateMessage(draftData.privateMessage || '');
        console.log('Draft loaded successfully!');
      } else if (response.status === 404) {
        // No draft found, do nothing
        console.log('No draft found');
      } else {
        console.error('Failed to load draft');
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category" className="block mb-2">Category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
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
              <li key={index}>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(image);
                    alert('Image URL copied to clipboard!');
                  }}
                  className="text-blue-500 hover:underline"
                >
                  {image}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex space-x-4">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          {post ? 'Update Post' : 'Create Post'}
        </button>
        {!post && (
          <>
            <button type="button" onClick={saveDraft} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Save Draft
            </button>
            <button type="button" onClick={loadDraft} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
              Load Draft
            </button>
          </>
        )}
      </div>
    </form>
  );
}