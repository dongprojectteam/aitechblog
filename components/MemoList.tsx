'use client'

import Memo from './Memo'

export default function MemoList({ memos, onUpdate, onDelete }) {
  return (
    <div className="space-y-4">
      {memos.map((memo) => (
        <Memo key={memo.id} memo={memo} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  )
}