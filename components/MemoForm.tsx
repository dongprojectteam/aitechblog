'use client'

import { useState, useEffect } from 'react'
import { FaPaperPlane, FaTimes, FaFont, FaExclamationTriangle } from 'react-icons/fa'

const MAX_CHARS = 1000 // 최대 글자 수 제한

export default function MemoForm({ onMemoAdded }) {
  const [content, setContent] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    setCharCount(content.length)
    setShowWarning(content.length > MAX_CHARS)
  }, [content])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (content.trim() && content.length <= MAX_CHARS) {
      await onMemoAdded(content)
      setContent('')
    }
  }

  const handleChange = (e) => {
    const newContent = e.target.value
    if (newContent.length <= MAX_CHARS) {
      setContent(newContent)
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-all duration-300 ease-in-out hover:shadow-xl">
      <h2 className="text-2xl font-semibold mb-4">Create New Memo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={handleChange}
            placeholder="Write your memo here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
          <div className="flex justify-between items-center mt-2 text-sm">
            <div className="flex items-center">
              <FaFont className="mr-1" />
              <span>{charCount} / {MAX_CHARS} characters</span>
            </div>
            {showWarning && (
              <span className="text-red-500 flex items-center">
                <FaExclamationTriangle className="mr-1" />
                Character limit exceeded
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setContent('')}
            className="btn bg-gray-500 hover:bg-gray-600"
          >
            <FaTimes className="mr-2" /> Clear
          </button>
          <button 
            type="submit" 
            className={`btn ${content.trim() && content.length <= MAX_CHARS ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
            disabled={!content.trim() || content.length > MAX_CHARS}
          >
            <FaPaperPlane className="mr-2" /> Save Memo
          </button>
        </div>
      </form>
    </div>
  )
}