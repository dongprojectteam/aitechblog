'use client'

import { useState, useEffect } from 'react'
import { FaEdit, FaTrash, FaSave, FaTimes, FaClock, FaFont } from 'react-icons/fa'

interface MemoProps {
  memo: Memo,
  onUpdate: (id: string, content: string) => Promise<void>,
  onDelete: (id: string) => Promise<void>
}
export default function Memo({ memo, onUpdate, onDelete }: MemoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(memo.content)
  const [charCount, setCharCount] = useState(memo.content.length)

  useEffect(() => {
    setCharCount(content.length)
  }, [content])

  const handleUpdate = async () => {
    await onUpdate(memo.id, content)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(memo.id)
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const CharCounter = () => (
    <div className="flex items-center text-gray-500 text-sm">
      <FaFont className="mr-1" />
      <span>{charCount} characters</span>
    </div>
  )

  if (isEditing) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 mb-4 transition-all duration-300 ease-in-out hover:shadow-xl">
        <textarea
          placeholder="Write Memo Here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <div className="flex justify-between items-center mt-4">
          <CharCounter />
          <div className="flex space-x-2">
            <button onClick={handleUpdate} className="btn bg-green-500 hover:bg-green-600">
              <FaSave className="mr-2" /> Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn bg-gray-500 hover:bg-gray-600">
              <FaTimes className="mr-2" /> Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4 transition-all duration-300 ease-in-out hover:shadow-xl">
      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{memo.content}</p>
      <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
        <div className="flex items-center">
          <FaClock className="mr-2" />
          <span>Created: {formatDate(memo.createdAt)}</span>
          {memo.updatedAt !== memo.createdAt && (
            <>
              <span className="mx-2">|</span>
              <span>Updated: {formatDate(memo.updatedAt)}</span>
            </>
          )}
        </div>
        <CharCounter />
      </div>
      <div className="flex justify-end space-x-2">
        <button onClick={() => setIsEditing(true)} className="btn bg-blue-500 hover:bg-blue-600">
          <FaEdit className="mr-2" /> Edit
        </button>
        <button onClick={handleDelete} className="btn bg-red-500 hover:bg-red-600">
          <FaTrash className="mr-2" /> Delete
        </button>
      </div>
    </div>
  )
}