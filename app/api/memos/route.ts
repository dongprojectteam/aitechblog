import { NextResponse } from 'next/server'
import { getMemos, createMemo, searchMemos } from '@/lib/memos'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const memos = search ? await searchMemos(search) : await getMemos()
    return NextResponse.json(memos)
  } catch (error) {
    console.error('Error fetching memos:', error)
    return NextResponse.json({ error: 'Failed to fetch memos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json()
    const newMemo = await createMemo(content)
    return NextResponse.json(newMemo, { status: 201 })
  } catch (error) {
    console.error('Error creating memo:', error)
    return NextResponse.json({ error: 'Failed to create memo' }, { status: 500 })
  }
}