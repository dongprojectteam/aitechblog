'use client';

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex justify-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Link href={createPageURL(currentPage - 1)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Previous
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
        <Link
          key={pageNumber}
          href={createPageURL(pageNumber)}
          className={`px-4 py-2 rounded ${
            pageNumber === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {pageNumber}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link href={createPageURL(currentPage + 1)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Next
        </Link>
      )}
    </div>
  )
}

export default Pagination