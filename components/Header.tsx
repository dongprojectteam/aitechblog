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
  const [isUtilityOpen, setIsUtilityOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleUtility = () => {
    setIsUtilityOpen(!isUtilityOpen)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const closeMenus = () => {
    setIsMenuOpen(false)
    setIsUtilityOpen(false)
  }

  const showSearch = pathname === '/' || pathname === '/book-review'

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div onClick={openModal} className="cursor-pointer">
            <Image
              src="/images/profile.jpg"
              alt="Donghyuk Kim"
              width={40}
              height={40}
              className="rounded-full border-2 border-white"
            />
          </div>
          <Link href="/" className="text-2xl font-bold">
            AI Tech Blog
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4 items-center">
          {showSearch && (
            <li className="mr-4">
              <SearchForm initialQuery="" currentPath={pathname} />
            </li>
          )}
          <li>
            <Link href="/" className="hover:text-gray-300" onClick={closeMenus}>
              AI
            </Link>
          </li>
          <li>
            <Link href="/book-review" className="hover:text-gray-300" onClick={closeMenus}>
              Review
            </Link>
          </li>
          <li className="relative">
            <button onClick={toggleUtility} className="hover:text-gray-300">
              Utility
            </button>
            {isUtilityOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-10">
                <li>
                  <Link href="/diff" className="block px-4 py-2 text-sm hover:bg-gray-600" onClick={closeMenus}>
                    DocDiff
                  </Link>
                </li>
                <li>
                  <Link href="/week-calendar" className="block px-4 py-2 text-sm hover:bg-gray-600" onClick={closeMenus}>
                    Week Calendar
                  </Link>
                </li>
                <li>
                  <Link href="/ladder" className="block px-4 py-2 text-sm hover:bg-gray-600" onClick={closeMenus}>
                    Ladder Game
                  </Link>
                </li>
                <li>
                  <Link href="/clocks" className="block px-4 py-2 text-sm hover:bg-gray-600" onClick={closeMenus}>
                    Clocks
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link href="/links" className="hover:text-gray-300" onClick={closeMenus}>
              Links
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-gray-300" onClick={closeMenus}>
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
            {showSearch && (
              <li className="mb-2">
                <SearchForm initialQuery="" currentPath={pathname} />
              </li>
            )}
            <li>
              <Link href="/" className="hover:text-gray-300" onClick={closeMenus}>
                AI
              </Link>
            </li>
            <li>
              <Link href="/book-review" className="hover:text-gray-300" onClick={closeMenus}>
                Review
              </Link>
            </li>
            <li>
              <button onClick={toggleUtility} className="w-full text-left hover:text-gray-300">
                Utility
              </button>
              {isUtilityOpen && (
                <ul className="pl-4 mt-2 space-y-2">
                  <li>
                    <Link href="/diff" className="hover:text-gray-300" onClick={closeMenus}>
                      DocDiff
                    </Link>
                  </li>
                  <li>
                    <Link href="/week-calendar" className="hover:text-gray-300" onClick={closeMenus}>
                      Week Calendar
                    </Link>
                  </li>
                  <li>
                    <Link href="/clocks" className="hover:text-gray-300" onClick={closeMenus}>
                      Clocks
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link href="/links" className="hover:text-gray-300" onClick={closeMenus}>
                Links
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gray-300" onClick={closeMenus}>
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