import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DRAFTS_DIR = path.join(process.cwd(), 'drafts')

export async function POST(request: NextRequest) {
  const { fileName, content } = await request.json()
  if (!fileName) {
    return NextResponse.json(
      { message: 'File name is required' },
      { status: 400 }
    )
  }

  const filePath = path.join(DRAFTS_DIR, fileName)

  try {
    await fs.mkdir(DRAFTS_DIR, { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(content))
    return NextResponse.json(
      { message: 'Draft saved successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ message: 'Error saving draft' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get('fileName')
  if (!fileName) {
    return NextResponse.json(
      { message: 'File name is required' },
      { status: 400 }
    )
  }

  const filePath = path.join(DRAFTS_DIR, fileName)

  try {
    const content = await fs.readFile(filePath, 'utf8')
    return NextResponse.json(JSON.parse(content), { status: 200 })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ message: 'Draft not found' }, { status: 404 })
    }
    return NextResponse.json(
      { message: 'Error loading draft' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get('fileName')
  if (!fileName) {
    return NextResponse.json(
      { message: 'File name is required' },
      { status: 400 }
    )
  }

  const filePath = path.join(DRAFTS_DIR, fileName)

  try {
    await fs.unlink(filePath)
    return NextResponse.json(
      { message: 'Draft deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ message: 'Draft not found' }, { status: 404 })
    }
    return NextResponse.json(
      { message: 'Error deleting draft' },
      { status: 500 }
    )
  }
}
