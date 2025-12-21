import type { Book, BookStatus, Comment } from '~/types/book'
import { v4 as uuidv4 } from 'uuid'

export const useBooksStore = defineStore('books', () => {
  const books = ref<Book[]>([])

  // Getters
  const readingBooks = computed(() => books.value.filter(b => b.status === "reading"))
  const droppedBooks = computed(() => books.value.filter(b => b.status === "dropped"))
  const willReadBooks = computed(() => books.value.filter(b => b.status === "will-read"))
  
  const allTags = computed(() => {
    const tags = new Set<string>()
    books.value.forEach(book => book.tags.forEach(tag => tags.add(tag)))
    return Array.from(tags).sort()
  })

  // Actions
  function addBook(book: Omit<Book, 'id' | 'addedAt' | 'updatedAt' | 'comments'>) {
    const newBook: Book = {
      ...book,
      id: uuidv4(),
      comments: [],
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    books.value.push(newBook)
  }

  function updateBook(id: string, updates: Partial<Book>) {
    const index = books.value.findIndex(b => b.id === id)
    if (index !== -1) {
      const existingBook = books.value[index]
      if (existingBook) {
        books.value[index] = {
          ...existingBook,
          ...updates,
          id: existingBook.id,
          updatedAt: new Date().toISOString()
        } as Book
      }
    }
  }

  function deleteBook(id: string) {
    books.value = books.value.filter(b => b.id !== id)
  }

  function addComment(bookId: string, text: string) {
    const book = books.value.find(b => b.id === bookId)
    if (book) {
      book.comments.push({
        id: uuidv4(),
        text,
        createdAt: new Date().toISOString()
      })
      book.updatedAt = new Date().toISOString()
    }
  }

  function deleteComment(bookId: string, commentId: string) {
    const book = books.value.find(b => b.id === bookId)
    if (book) {
      book.comments = book.comments.filter(c => c.id !== commentId)
      book.updatedAt = new Date().toISOString()
    }
  }

  return {
    books,
    readingBooks,
    droppedBooks,
    willReadBooks,
    allTags,
    addBook,
    updateBook,
    deleteBook,
    addComment,
    deleteComment
  }
}, {
  persist: {
    storage: {
      getItem: (key) => typeof window !== 'undefined' ? localStorage.getItem(key) : null,
      setItem: (key, value) => typeof window !== 'undefined' ? localStorage.setItem(key, value) : null,
    },
  }
})
