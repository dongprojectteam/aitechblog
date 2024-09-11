import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  // 현재 호스트를 사용하여 절대 URL 생성
  const protocol = request.nextUrl.protocol;
  const host = request.headers.get('host');
  const apiUrl = `${protocol}//${host}/api/log-visit`;

  // API 라우트를 호출하여 방문 데이터 저장
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  }).catch(error => console.error('Error logging visit:', error));

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|favicon.ico|uploads/|images/).*)',
};