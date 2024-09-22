'use client';

import React, { useState } from 'react';

interface AdminFormProps {
  initialData: AISitesData;
  onSubmit: (data: AISitesData) => Promise<void>;
}

export default function AdminForm({ initialData, onSubmit }: AdminFormProps) {
  const [formData, setFormData] = useState<AISitesData>(initialData);

  const handleChange = (categoryIndex: number, siteIndex: number, field: keyof AISite, value: string) => {
    const newData = { ...formData };
    newData.aiSites[categoryIndex].sites[siteIndex][field] = value;
    setFormData(newData);
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newData = { ...formData };
    newData.aiSites[index].category = value;
    setFormData(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const addSite = (categoryIndex: number) => {
    const newData = { ...formData };
    newData.aiSites[categoryIndex].sites.push({
      title: '',
      description: '',
      url: '',
      imageUrl: ''
    });
    setFormData(newData);
  };

  const removeSite = (categoryIndex: number, siteIndex: number) => {
    const newData = { ...formData };
    newData.aiSites[categoryIndex].sites.splice(siteIndex, 1);
    setFormData(newData);
  };

  const addCategory = () => {
    const newData = { ...formData };
    newData.aiSites.push({
      category: '',
      sites: []
    });
    setFormData(newData);
  };

  const removeCategory = (categoryIndex: number) => {
    const newData = { ...formData };
    newData.aiSites.splice(categoryIndex, 1);
    setFormData(newData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">AI Sites Management</h2>
      {formData.aiSites.map((category, categoryIndex) => (
        <div key={categoryIndex} className="border p-4 rounded-lg bg-gray-50">
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={category.category}
              onChange={(e) => handleCategoryChange(categoryIndex, e.target.value)}
              className="flex-grow p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Category name"
            />
            <button
              type="button"
              onClick={() => removeCategory(categoryIndex)}
              className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
            >
              Remove Category
            </button>
          </div>
          {category.sites.map((site, siteIndex) => (
            <div key={siteIndex} className="mb-4 p-4 border rounded bg-white shadow-sm">
              <input
                type="text"
                value={site.title}
                onChange={(e) => handleChange(categoryIndex, siteIndex, 'title', e.target.value)}
                className="w-full mb-2 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Title"
              />
              <input
                type="text"
                value={site.description}
                onChange={(e) => handleChange(categoryIndex, siteIndex, 'description', e.target.value)}
                className="w-full mb-2 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Description"
              />
              <input
                type="text"
                value={site.url}
                onChange={(e) => handleChange(categoryIndex, siteIndex, 'url', e.target.value)}
                className="w-full mb-2 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="URL"
              />
              <input
                type="text"
                value={site.imageUrl}
                onChange={(e) => handleChange(categoryIndex, siteIndex, 'imageUrl', e.target.value)}
                className="w-full mb-2 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Image URL"
              />
              <button
                type="button"
                onClick={() => removeSite(categoryIndex, siteIndex)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
              >
                Remove Site
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addSite(categoryIndex)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
          >
            Add Site
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addCategory}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
      >
        Add Category
      </button>
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200">
        Save Changes
      </button>
    </form>
  );
}