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

  // 표시할 페이지 번호 범위 계산
  const getPageRange = () => {
    const delta = 2; // 현재 페이지 양쪽에 표시할 페이지 수
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i == 1 || i == totalPages || i >= currentPage - delta && i <= currentPage + delta) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Link href={createPageURL(currentPage - 1)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Previous
        </Link>
      )}
      {getPageRange().map((pageNumber, index) => (
        pageNumber === '...' ? (
          <span key={index} className="px-4 py-2">...</span>
        ) : (
          <Link
            key={index}
            href={createPageURL(pageNumber)}
            className={`px-4 py-2 rounded ${
              pageNumber === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {pageNumber}
          </Link>
        )
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