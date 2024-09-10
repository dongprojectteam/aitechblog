import { FaSearch } from 'react-icons/fa'

interface NoPostsFoundProps {
  searchQuery: string
}

export default function NoPostsFound({ searchQuery }: NoPostsFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-xl p-12 text-center mt-8">
      <FaSearch className="text-6xl text-blue-500 mb-6" />
      <h2 className="text-3xl font-bold text-gray-800 mb-4">No Posts Found</h2>
      <p className="text-xl text-gray-600 mb-8">
        {searchQuery ? `No posts match your search for "${searchQuery}".` : `We're working on creating amazing content for you. Check back soon!`}
      </p>
      <div className="w-16 h-1 bg-blue-500 rounded-full mb-8"></div>
      <p className="text-gray-500 italic">
        {`"The best preparation for tomorrow is doing your best today." - H. Jackson Brown Jr.`}
      </p>
    </div>
  )
}