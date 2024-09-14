'use client';

import { useState, useEffect } from 'react';

interface BookReviewForm {
  review: BookReview | null;
  onUpdate: (() => void) | null;
}

export default function BookReviewForm({ review = null, onUpdate = null }: BookReviewForm) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [updated, setUpdated] = useState('');


  // Load review data if it's provided (for editing)
  useEffect(() => {
    if (review) {
      setTitle(review.title);
      setAuthor(review.author);
      setRating(review.rating);
      setContent(review.content);
      setTags(review.tags.join(', '));
      setCoverImage(review.coverImage);
      setUploadedImages(review.uploadedImages || []);
      setUpdated(review.updated || ''); // 추가된 부분
    } else {
      loadDraft(); // Load draft if it's a new review
    }
  }, [review]);

  // Automatically set the cover image to the first uploaded image if no cover image is selected
  useEffect(() => {
    if (uploadedImages.length > 0 && !coverImage) {
      setCoverImage(uploadedImages[0]);
    }
  }, [uploadedImages, coverImage]);

  // Handle form submission for both creating and updating reviews
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    const now = new Date().toISOString();
    const reviewData = {
      title,
      author,
      rating,
      content,
      tags: trimmedTags,
      uploadedImages,
      coverImage,
      date: review ? review.date : now,
      updated: now
    };

    const url = review ? `/api/book-reviews/?fileName=${review.id || review.slug}.md` : '/api/book-reviews';
    const method = review ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (response.ok) {
      alert(review ? 'Book review updated successfully!' : 'Book review created successfully!');
      if (onUpdate) {
        onUpdate(); // Notify parent component to refresh the list
      } else {
        resetForm(); // Clear the form if it's a new review
        // router.refresh(); // Refresh the page after creating a new review
      }
    } else {
      alert(review ? 'Failed to update book review' : 'Failed to create book review');
    }
  };

  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setRating(5);
    setContent('');
    setTags('');
    setCoverImage('');
    setUploadedImages([]);
    setUpdated('')
  };

  // Handle image uploads
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
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
    }
  };

  // Save a draft of the book review
  const saveDraft = async () => {
    const draftData = { title, author, rating, content, tags, coverImage, uploadedImages, updated };
    try {
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: 'book_review_draft.json',
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

  // Load the draft if available
  const loadDraft = async () => {
    try {
      const response = await fetch('/api/drafts?fileName=book_review_draft.json');
      if (response.ok) {
        const draftData = await response.json();
        setTitle(draftData.title);
        setAuthor(draftData.author);
        setRating(draftData.rating);
        setContent(draftData.content || '');
        setTags(draftData.tags || '');
        setCoverImage(draftData.coverImage);
        setUploadedImages(draftData.uploadedImages || []);
        setUpdated(draftData.updated || ''); // 추가된 부분
        console.log('Draft loaded successfully!');
      } else if (response.status === 404) {
        // No draft found, do nothing
      } else {
        console.log('Failed to load draft');
      }
    } catch (error) {
      console.error('Error loading draft:', error);
      console.log('Error loading draft');
    }
  };

  const deleteDraft = async () => {
    try {
      const response = await fetch('/api/drafts?fileName=book_review_draft.json', {
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


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2">Book Title:</label>
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
        <label htmlFor="author" className="block mb-2">Author:</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="rating" className="block mb-2">Rating (1-5):</label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min="1"
          max="5"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2">Review Content:</label>
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
        <label htmlFor="coverImage" className="block mb-2">Cover Image:</label>
        <input
          type="file"
          id="coverImage"
          accept="image/*"
          onChange={handleImageUpload}
          multiple
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      {uploadedImages.length > 0 && (
        <div>
          <p className="mb-2">Select Cover Image:</p>
          <div className="grid grid-cols-3 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  className={`w-full h-32 object-cover cursor-pointer ${coverImage === image ? 'border-4 border-blue-500' : ''}`}
                  onClick={() => setCoverImage(image)}
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(image);
                    alert('Image URL copied to clipboard!');
                  }}
                  className="absolute top-0 right-0 bg-blue-500 text-white p-1 text-xs"
                >
                  Copy URL
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex space-x-4">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          {review ? 'Update Book Review' : 'Create Book Review'}
        </button>
        {!review && (
          <>
            <button type="button" onClick={saveDraft} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Save Draft
            </button>
            <button type="button" onClick={loadDraft} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
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
    </form>
  );
}

