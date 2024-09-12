import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'visits.json')

  try {
    const fileContents = await fs.readFile(filePath, 'utf8')
    const visits = JSON.parse(fileContents)
    return NextResponse.json({ success: true, visits })
  } catch (error) {
    console.error('Error reading visits file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to read visits data' },
      { status: 500 }
    )
  }
}
