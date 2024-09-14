// app/api/posts/preview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

export async function POST(request: NextRequest) {
  const { content } = await request.json();

  try {
    const processedContent = await remark()
      .use(remarkGfm)
      .use(html)
      .process(content);
    const contentHtml = processedContent.toString();

    return NextResponse.json({ html: contentHtml }, { status: 200 });
  } catch (error) {
    console.error('Error processing markdown:', error);
    return NextResponse.json({ message: 'Failed to process markdown' }, { status: 500 });
  }
}