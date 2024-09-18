// app/api/posts/preview/route.ts
import { NextRequest, NextResponse } from 'next/server'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'
import remarkParse from 'remark-parse'

export async function POST(request: NextRequest) {
  const { content } = await request.json()

  try {
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm) // GitHub Flavored Markdown 지원 추가
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeHighlight) // 코드 블록 구문 강조 추가
      .use(rehypeStringify)
      .process(content)
      const contentHtml = processedContent.toString()

    return NextResponse.json({ html: contentHtml }, { status: 200 })
  } catch (error) {
    console.error('Error processing markdown:', error)
    return NextResponse.json(
      { message: 'Failed to process markdown' },
      { status: 500 }
    )
  }
}
