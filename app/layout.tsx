import { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import 'katex/dist/katex.min.css'

export const metadata: Metadata = {
  title: {
    default: 'AI Tech Blog',
    template: '%s | AI Tech Blog'
  },
  description: 'Introducing AI Techs, especially Generative AI.',
  keywords: ['블로그', '기술', 'Next.js', 'React', 'Generative AI', 'AI', 'Artificial AI', 'Big Data'], // 관련 키워드 추가
  authors: [{ name: 'Donghyuk Kim' }],
  creator: 'Donghyuk Kim',
  publisher: 'Dong Project Team',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://www.doptsw.com/',
    siteName: 'AI Tech Blog',
    images: [
      {
        url: 'https://www.doptsw.com/og-image.jpg', // Open Graph 이미지 URL
        width: 1200,
        height: 630,
        alt: 'AI Tech Blog',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico'
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}