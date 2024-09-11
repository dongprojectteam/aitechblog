import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(request: NextRequest) {
  const imageUrl = request.nextUrl.searchParams.get('url');
  if (!imageUrl) {
    return NextResponse.json(
      { message: 'Image URL is required' },
      { status: 400 }
    );
  }

  // public/images 폴더의 경로 설정
  const imagePath = path.join(process.cwd(), 'public', 'images', new URL(imageUrl).pathname);

  try {
    await fs.unlink(imagePath);
    return NextResponse.json(
      { message: 'Image deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }
    return NextResponse.json(
      { message: 'Error deleting image' },
      { status: 500 }
    );
  }
}