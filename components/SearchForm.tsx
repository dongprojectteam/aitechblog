'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { FaSearch } from 'react-icons/fa'

interface SearchFormProps {
  initialQuery?: string
}

export default function SearchForm({ initialQuery = '' }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex justify-center mb-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
        className="w-64 px-4 py-2 rounded-l-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        title="search"
        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
      >
        <FaSearch />
      </button>
    </form>
  )
}