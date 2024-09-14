declare global {
  interface Post {
    id: string
    slug?: string
    author: string
    title: string
    content: string
    contentHtml?: string
    tags: string[]
    date: string
    updated?: string
    category: string
    uploadedImages: string[]
    privateMessage?: string
  }

  interface BookReview {
    id: string
    slug?: string
    title: string
    author: string
    rating: number
    content: string
    tags: string[]
    uploadedImages: string[]
    coverImage: string
    date: string
    updated?: string
  }

  interface Memo {
    id: string
    content: string
    length: number
    createdAt: string
    updatedAt: string
  }
}

export {} // This file needs to be a module
