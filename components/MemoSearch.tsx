'use client'

import { useState } from 'react'
import { FaSearch, FaList } from 'react-icons/fa'

export default function MemoSearch({ onSearch, onViewAll }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search memos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button type="submit" className="btn bg-blue-500 hover:bg-blue-600 flex items-center">
          <FaSearch className="mr-2" />
          Search
        </button>
        <button
          type="button"
          onClick={onViewAll}
          className="btn bg-gray-500 hover:bg-gray-600 flex items-center"
        >
          <FaList className="mr-2" />
          View All
        </button>
      </form>
    </div>
  )
}