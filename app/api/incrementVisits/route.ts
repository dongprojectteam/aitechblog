import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface Visits {
  [page: string]: number;
}

export async function POST(request: NextRequest) {
  const { page } = await request.json();

  if (!page || typeof page !== 'string') {
    return NextResponse.json({ error: 'Invalid page parameter' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'data', 'visits.json');
  let visits: Visits = {};

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    visits = JSON.parse(fileContents);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // 파일이 존재하지 않을 경우 새로운 객체로 시작합니다
      console.log('visits.json file not found. Creating a new one.');
    } else {
      // 다른 오류의 경우 콘솔에 기록하고 계속 진행합니다
      console.error('Error reading visits file:', error);
    }
  }

  visits[page] = (visits[page] || 0) + 1;

  try {
    await fs.writeFile(filePath, JSON.stringify(visits));
  } catch (error) {
    console.error('Error writing visits file:', error);
    return NextResponse.json({ error: 'Failed to update visits' }, { status: 500 });
  }

  return NextResponse.json({ success: true, visits: visits[page] });
}