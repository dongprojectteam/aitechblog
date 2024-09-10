import { NextResponse } from 'next/server'
import { updateMemo, deleteMemo } from '@/lib/memos'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { content } = await request.json()
    const updatedMemo = await updateMemo(params.id, content)
    if (updatedMemo) {
      return NextResponse.json(updatedMemo)
    } else {
      return NextResponse.json({ error: 'Memo not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error updating memo:', error)
    return NextResponse.json({ error: 'Failed to update memo' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteMemo(params.id)
    return NextResponse.json({ message: 'Memo deleted successfully' })
  } catch (error) {
    console.error('Error deleting memo:', error)
    return NextResponse.json({ error: 'Failed to delete memo' }, { status: 500 })
  }
}