export type BookStatus = 'reading' | 'dropped' | 'will-read' | 'finished'

export interface Comment {
  id: string
  text: string
  createdAt: string
}

export interface Book {
  id: string
  title: string
  author: string
  coverUrl?: string
  description?: string
  status: BookStatus
  rating: number // 0-5
  tags: string[]
  comments: Comment[]
  addedAt: string
  updatedAt: string
}
