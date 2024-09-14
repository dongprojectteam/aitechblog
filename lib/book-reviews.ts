import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import crypto from 'crypto'

const bookReviewsDirectory = path.join(process.cwd(), 'book-reviews')

export async function getSortedBookReviewsData() {
  const fileNames = fs.readdirSync(bookReviewsDirectory)
  const allBookReviewsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const id = fileName.replace(/\.md$/, '')
      const fullPath = path.join(bookReviewsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)

      return {
        id,
        ...(matterResult.data as {
          date: string
          updated: string
          title: string
          author: string
          rating: number
          tags: string[]
          coverImage: string
        }),
      }
    })
  )

  return allBookReviewsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getBookReviewData(slug: string) {
  const fullPath = path.join(bookReviewsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    slug,
    content: matterResult.content,
    contentHtml,
    ...(matterResult.data as {
      date: string
      updated: string
      title: string
      author: string
      rating: number
      coverImage: string
      tags: string[]
      reviewer: string
    }),
  }
}

export function deleteBookReview(id: string) {
  const fullPath = path.join(bookReviewsDirectory, `${id}.md`)
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
  } else {
    throw new Error('Book review not found')
  }
}

export function createBookReview(reviewData: {
  title: string
  author: string
  rating: number
  content: string
  tags: string[]
  uploadedImages: string[]
  coverImage: string
  date: string
}) {
  const {
    title,
    author,
    rating,
    content,
    tags,
    uploadedImages,
    coverImage,
    date,
  } = reviewData

  const formattedDateTime = new Date(date)
    .toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '')
  const formattedDate = formattedDateTime.split(' ')[0]

  const hash = crypto
    .createHash('md5')
    .update(title)
    .digest('hex')
    .substring(0, 6)
  const fileName = `book_review_${formattedDate}_${hash}.md`
  const filePath = path.join(bookReviewsDirectory, fileName)

  const fileContent = `---
title: "${title}"
author: "${author}"
rating: ${rating}
date: "${formattedDateTime}"
updated: "${formattedDateTime}"
tags: [${tags.map((tag: string) => `"${tag}"`).join(', ')}]
uploadedImages: [${uploadedImages
    .map((image: string) => `"${image}"`)
    .filter((image: string) => image.trim().length > 0)
    .join(', ')}]
coverImage: "${coverImage}"
---

${content}
`

  if (!fs.existsSync(bookReviewsDirectory)) {
    fs.mkdirSync(bookReviewsDirectory, { recursive: true })
  }

  fs.writeFileSync(filePath, fileContent)
  return fileName
}

export function updateBookReview(fileName: string, reviewData: BookReview) {
  const {
    title,
    author,
    rating,
    content,
    tags,
    uploadedImages,
    coverImage,
    date,
  } = reviewData

  const filePath = path.join(bookReviewsDirectory, fileName)

  if (!fs.existsSync(filePath)) {
    throw new Error('Book review not found')
  }

  const formattedDateTime = new Date()
    .toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '')

  const fileContent = `---
title: "${title}"
author: "${author}"
rating: ${rating}
date: "${date}"
updated: "${formattedDateTime}"
tags: [${tags.map((tag: string) => `"${tag}"`).join(', ')}]
uploadedImages: [${uploadedImages
    .map((image: string) => `"${image}"`)
    .filter((image: string) => image.trim().length > 0)
    .join(', ')}]
coverImage: "${coverImage}"
---

${content}
`

  fs.writeFileSync(filePath, fileContent)
}
