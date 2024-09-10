import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import crypto from 'crypto'
import CryptoJS from 'crypto-js'

const postsDirectory = path.join(process.cwd(), 'posts')

// 환경 변수에서 암호화 키 가져오기
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY is not set in environment variables')
}

// 암호화 함수
export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY!).toString()
}

// 복호화 함수
export function decrypt(encryptedText: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY!)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export function getSortedPostsData(): Post[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data),
    } 
  }) as Post[]
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Decrypt privateMessage if it exists
  let privateMessage = matterResult.data.privateMessage
  if (privateMessage) {
    privateMessage = decrypt(privateMessage)
  }

  // Combine the data with the id and contentHtml

  return {
    id,
    contentHtml,
    content: matterResult.content,
    ...(matterResult.data) as {
      title: string
      date: string
      tags: string[]
      category: string
      uploadedImages: string[]
      author: string
    },
    privateMessage,
  } as Post
}

export function createPost(postData: {
  title: string
  content: string
  tags: string[]
  date: string
  category: string
  uploadedImages: string[]
  privateMessage?: string
}) {
  const {
    title,
    content,
    tags,
    date,
    category,
    uploadedImages,
    privateMessage,
  } = postData

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
  const fileName = `post_${formattedDate}_${hash}.md`
  const filePath = path.join(postsDirectory, fileName)

  const encryptedPrivateMessage = privateMessage ? encrypt(privateMessage) : ''

  const fileContent = `---
title: "${title}"
date: "${formattedDateTime}"
tags: [${tags.map((tag: string) => `"${tag}"`).join(', ')}]
category: "${category}"
author: "Donghyuk Kim"
uploadedImages: [${uploadedImages
    .map((image: string) => `"${image}"`)
    .filter((image: string) => image.trim().length > 0)
    .join(', ')}]
privateMessage: "${encryptedPrivateMessage}"
---

${content}
`

  fs.writeFileSync(filePath, fileContent)
  return fileName
}

export function updatePost(
  fileName: string,
  postData: Post
) {
  const {
    title,
    content,
    tags,
    date,
    category,
    uploadedImages,
    privateMessage,
  } = postData

  const filePath = path.join(postsDirectory, fileName)

  if (!fs.existsSync(filePath)) {
    throw new Error('Post not found')
  }

  const formattedDateTime = new Date(date)
    .toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '')

  const encryptedPrivateMessage = privateMessage ? encrypt(privateMessage) : ''

  const fileContent = `---
title: "${title}"
date: "${formattedDateTime}"
tags: [${tags.map((tag: string) => `"${tag}"`).join(', ')}]
category: "${category}"
author: "Donghyuk Kim"
uploadedImages: [${uploadedImages
    .map((image: string) => `"${image}"`)
    .filter((image: string) => image.trim().length > 0)
    .join(', ')}]
privateMessage: "${encryptedPrivateMessage}"
---

${content}
`

  fs.writeFileSync(filePath, fileContent)
}

export function deletePost(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
  } else {
    throw new Error('Post not found')
  }
}