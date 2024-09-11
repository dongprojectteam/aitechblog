'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaSearch } from 'react-icons/fa'

export default function SearchForm({ initialQuery, currentPath }: { initialQuery: string, currentPath: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 경로가 변경될 때 쿼리 초기화
    setQuery('');
  }, [pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPath === '/book-review') {
      router.push(`/book-review?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="border border-gray-300 rounded-l-md p-1 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
      <button title="Search" type="submit" className="bg-blue-500 text-white rounded-r-md px-2 hover:bg-blue-600 transition duration-300">
        <FaSearch className="mr-1" />
      </button>
    </form>
  );
}