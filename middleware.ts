import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import fs from 'fs';

export async function middleware(request: NextRequest) {
  console.log(`Middleware executed for: ${request.nextUrl.pathname}`);

  const logMessage = `Middleware executed for: ${request.nextUrl.pathname}\n`;
  fs.appendFileSync('/home/ubuntu/log.txt', logMessage);

  const url = request.nextUrl.pathname;

  // 현재 호스트를 사용하여 절대 URL 생성
  const protocol = request.nextUrl.protocol;
  const host = request.headers.get('host');
  const apiUrl = `${protocol}//${host}/api/log-visit`;

  console.log(`Middleware apiUrl: ${apiUrl}`);

  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    console.log(`Visit logged for: ${url}`);
  } catch (error) {
    console.error('Error logging visit:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|favicon.ico|uploads/|images/).*)',
};
