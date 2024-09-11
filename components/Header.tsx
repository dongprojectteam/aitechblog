'use client';

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import ImageModal from './ImageModal'
import SearchForm from './SearchForm'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const isHomePage = pathname === '/'

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* 프로필 이미지 */}
          <div onClick={openModal} className="cursor-pointer">
            <Image
              src="/images/profile.jpg"
              alt="Donghyuk Kim"
              width={40}
              height={40}
              className="rounded-full border-2 border-white"
            />
          </div>
          {/* 블로그 타이틀 */}
          <Link href="/" className="text-2xl font-bold">
            AI Tech Blog
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4 items-center">
          {isHomePage && (
            <li className="mr-4">
              <SearchForm initialQuery="" />
            </li>
          )}
          <li>
            <Link href="/" className="hover:text-gray-300">
              AI
            </Link>
          </li>
          <li>
            <Link href="/book-review" className="hover:text-gray-300">
              Review
            </Link>
          </li>
          <li>
            <Link href="/diff" className="hover:text-gray-300">
              Doc.Diff
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-gray-300">
              About
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          type="button"
          title="about"
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden">
          <ul className="bg-gray-700 mt-2 py-2 px-4 space-y-2">
            {isHomePage && (
              <li className="mb-2">
                <SearchForm initialQuery="" />
              </li>
            )}
            <li>
              <Link href="/" className="hover:text-gray-300">
                AI
              </Link>
            </li>
            <li>
              <Link href="/book-review" className="hover:text-gray-300">
                Review
              </Link>
            </li>
            <li>
              <Link href="/diff" className="hover:text-gray-300">
                Diff Util
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gray-300">
                About
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Image Modal */}
      <ImageModal
        src="/images/profile.jpg"
        alt="Author"
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </header>
  )
}

export default Header