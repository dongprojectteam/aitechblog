import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 파일 이름에 타임스탬프를 추가하여 유니크하게 만듭니다.
  const filename = Date.now() + '_' + file.name.replace(/\s/g, '_');
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

  try {
    await writeFile(filepath, buffer);
    return NextResponse.json({ 
      success: true, 
      filepath: '/uploads/' + filename 
    });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ success: false });
  }
}