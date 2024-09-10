'use client'

import Memo from './Memo'

interface MemoListProps {
  memos: Memo[],
  onUpdate: (id: string, content: string) => Promise<void>,
  onDelete: (id: string) => Promise<void>
}

export default function MemoList({ memos, onUpdate, onDelete }: MemoListProps) {
  return (
    <div className="space-y-4">
      {memos.map((memo) => (
        <Memo key={memo.id} memo={memo} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  )
}