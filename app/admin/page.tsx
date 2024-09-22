'use client';

import { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import ContentForm from '@/components/ContentForm';
import ContentList from '@/components/ContentList';
import BookReviewForm from '@/components/BookReviewForm';
import BookReviewList from '@/components/BookReviewList';
import MemoList from '@/components/MemoList'
import MemoForm from '@/components/MemoForm'
import MemoSearch from '@/components/MemoSearch'
import StatsView from '@/components/StatsView';
import AISitesForm from '@/components/AISitesForm';

const ADMIN_CREDENTIALS = {
  username: process.env.NEXT_PUBLIC_ADMIN_USERNAME,
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
};

const TABS = {
  CONTENT: 'content',
  BOOK_REVIEW: 'bookReview',
  MEMO: 'memo',
  STATS: 'stats',
  AI_SITES: 'aiSites' // 새로운 탭 추가
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.CONTENT);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedReview, setSelectedReview] = useState<BookReview | null>(null);
  const [isNewPost, setIsNewPost] = useState(false);
  const [isNewReview, setIsNewReview] = useState(false);
  const [memos, setMemos] = useState<[] | Memo[]>([])
  const [aiSites, setAiSites] = useState<AISitesData | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAiSites();
    }
  }, [isLoggedIn]);

  const fetchAiSites = async () => {
    try {
      const response = await fetch('/api/aiSites');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAiSites(data);
    } catch (error) {
      console.error('Error fetching AI sites:', error);
    }
  };

  const updateAiSites = async (updatedData: AISitesData) => {
    try {
      const response = await fetch('/api/aiSites', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setAiSites(updatedData);
      alert('AI Sites updated successfully!');
    } catch (error) {
      console.error('Error updating AI sites:', error);
      alert('Failed to update AI Sites');
    }
  };


  const handleLogin = (username: string, password: string) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const handlePostSelect = (post: Post) => {
    setSelectedPost(post);
    setIsNewPost(false);
  };


  const handleReviewSelect = (review: BookReview) => {
    setSelectedReview(review);
    setIsNewReview(false);
  };


  const handleNewPost = () => {
    setSelectedPost(null);
    setIsNewPost(true);
  };

  const handleNewReview = () => {
    setSelectedReview(null);
    setIsNewReview(true)
  }

  const handlePostUpdate = () => {
    setSelectedPost(null);
    setIsNewPost(false);
  };

  const handleReviewUpdate = () => {
    setSelectedReview(null);
    setIsNewReview(false);
  };

  const handleSearch = (term: string) => {
    fetchMemos(term)
  }

  const handleViewAll = () => {
    fetchMemos(); // 모든 메모를 다시 불러옴
  };

  const fetchMemos = async (search = '') => {
    try {
      const response = await fetch(`/api/memos?search=${encodeURIComponent(search)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setMemos(data)
    } catch (error) {
      console.error('Error fetching memos:', error)
    }
  }

  const addMemo = async (content: string) => {
    try {
      const response = await fetch('/api/memos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newMemo = await response.json();
      setMemos(prevMemos => [newMemo, ...prevMemos]);
    } catch (error) {
      console.error('Error adding memo:', error);
    }
  }

  const updateMemo = async (id: string, content: string) => {
    try {
      const response = await fetch(`/api/memos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedMemo = await response.json();
      setMemos(prevMemos => prevMemos.map(memo => memo.id === id ? updatedMemo : memo));
    } catch (error) {
      console.error('Error updating memo:', error);
    }
  }

  const deleteMemo = async (id: string) => {
    try {
      const response = await fetch(`/api/memos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setMemos(prevMemos => prevMemos.filter(memo => memo.id !== id));
    } catch (error) {
      console.error('Error deleting memo:', error);
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.CONTENT:
        if (selectedPost || isNewPost) {
          return <ContentForm post={selectedPost} onUpdate={handlePostUpdate} />;
        } else {
          return (
            <div>
              <button
                type="button"
                onClick={handleNewPost}
                className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                New Post
              </button>
              <ContentList onPostSelect={handlePostSelect} />
            </div>
          );
        }
      case TABS.BOOK_REVIEW:
        if (selectedReview || isNewReview) {
          return <BookReviewForm review={selectedReview} onUpdate={handleReviewUpdate} />;
        } else {
          return (
            <div>
              <button
                type="button"
                onClick={handleNewReview}
                className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                New Review
              </button>
              <BookReviewList onReviewSelect={handleReviewSelect} />
            </div>
          );
        }
      case TABS.MEMO:
        return (
          <main className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">My Memos</h1>
            <MemoSearch onSearch={handleSearch} onViewAll={handleViewAll} />
            <MemoForm onMemoAdded={addMemo} />
            <MemoList memos={memos} onUpdate={updateMemo} onDelete={deleteMemo} />
          </main>
        )
      case TABS.STATS:
        return <StatsView />;
      case TABS.AI_SITES:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">AI Sites Editor</h2>
            {aiSites ? (
              <AISitesForm initialData={aiSites} onSubmit={updateAiSites} />
            ) : (
              <p>Loading AI sites data...</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };


  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="mb-6">
        <nav className="flex border-b border-gray-200">
          <TabButton
            isActive={activeTab === TABS.CONTENT}
            onClick={() => {
              setActiveTab(TABS.CONTENT);
              handlePostUpdate()
            }}
            label="Content"
          />
          <TabButton
            isActive={activeTab === TABS.BOOK_REVIEW}
            onClick={() => {
              setActiveTab(TABS.BOOK_REVIEW)
              handleReviewUpdate()
            }}
            label="Book Review"
          />

          <TabButton
            isActive={activeTab === TABS.MEMO}
            onClick={() => setActiveTab(TABS.MEMO)}
            label="Memo"
          />
          <TabButton
            isActive={activeTab === TABS.STATS}
            onClick={() => setActiveTab(TABS.STATS)}
            label="Statistics"
          />
          <TabButton
            isActive={activeTab === TABS.AI_SITES}
            onClick={() => setActiveTab(TABS.AI_SITES)}
            label="AI Sites"
          />
        </nav>
      </div>
      {renderTabContent()}
    </div>
  );
}

function TabButton({ isActive, onClick, label }: { isActive: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        py-2 px-4 text-sm font-medium text-center
        border-b-2 transition-colors duration-300
        ${isActive
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
      `}
    >
      {label}
    </button>
  );
}