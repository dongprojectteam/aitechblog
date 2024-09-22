'use client';

import React, { useState, useEffect } from 'react';

interface AISitesFormProps {
  isLoggedIn: boolean;
}

export default function AISitesForm({ isLoggedIn }: AISitesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleChange = (categoryIndex: number, siteIndex: number, field: keyof AISite, value: string) => {
    if (aiSites) {
      const newData = { ...aiSites };
      newData.aiSites[categoryIndex].sites[siteIndex][field] = value;
      setAiSites(newData);
    }
  };

  const handleCategoryChange = (index: number, value: string) => {
    if (aiSites) {
      const newData = { ...aiSites };
      newData.aiSites[index].category = value;
      setAiSites(newData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/aiSites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aiSites),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert('AI Sites updated successfully!');
    } catch (error) {
      console.error('Error updating AI sites:', error);
      alert('Failed to update AI Sites');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSite = (categoryIndex: number) => {
    if (aiSites) {
      const newData = { ...aiSites };
      newData.aiSites[categoryIndex].sites.push({
        title: '',
        description: '',
        url: '',
        imageUrl: ''
      });
      setAiSites(newData);
    }
  };

  const removeSite = (categoryIndex: number, siteIndex: number) => {
    if (aiSites) {
      const newData = { ...aiSites };
      newData.aiSites[categoryIndex].sites.splice(siteIndex, 1);
      setAiSites(newData);
    }
  };

  const addCategory = () => {
    if (aiSites) {
      const newData = { ...aiSites };
      newData.aiSites.push({
        category: '',
        sites: []
      });
      setAiSites(newData);
    }
  };

  const removeCategory = (categoryIndex: number) => {
    if (aiSites) {
      const newData = { ...aiSites };
      newData.aiSites.splice(categoryIndex, 1);
      setAiSites(newData);
    }
  };

  if (!aiSites) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">AI Sites Management</h2>
      {aiSites.aiSites.map((category, categoryIndex) => (
        <div key={categoryIndex} className="border p-6 rounded-lg bg-gray-50 shadow-sm mb-8">
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={category.category}
              onChange={(e) => handleCategoryChange(categoryIndex, e.target.value)}
              className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-semibold"
              placeholder="Category name"
            />
            <button
              type="button"
              onClick={() => removeCategory(categoryIndex)}
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 text-sm"
            >
              Remove Category
            </button>
          </div>
          {category.sites.map((site, siteIndex) => (
            <div key={siteIndex} className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
              <div className="flex mb-4">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={site.title}
                    onChange={(e) => handleChange(categoryIndex, siteIndex, 'title', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Title"
                  />
                </div>
                <div className="ml-4 flex-shrink-0">
                  {site.imageUrl && (
                    <img
                      src={site.imageUrl}
                      alt={site.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={site.description}
                  onChange={(e) => handleChange(categoryIndex, siteIndex, 'description', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Description"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={site.url}
                  onChange={(e) => handleChange(categoryIndex, siteIndex, 'url', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="URL"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={site.imageUrl}
                  onChange={(e) => handleChange(categoryIndex, siteIndex, 'imageUrl', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Image URL"
                />
              </div>
              <button
                type="button"
                onClick={() => removeSite(categoryIndex, siteIndex)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 text-sm"
              >
                Remove Site
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addSite(categoryIndex)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 text-sm"
          >
            Add Site
          </button>
        </div>
      ))}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={addCategory}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-lg font-semibold"
        >
          Add Category
        </button>
        <button
          type="submit"
          className={`px-6 py-3 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg transition duration-200 text-lg font-semibold`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}