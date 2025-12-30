import type { Book, BookStatus, Comment } from '~/types/book'
import { v4 as uuidv4 } from 'uuid'
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where,
  writeBatch
} from 'firebase/firestore'
import { useFirebase } from '~/lib/firebase'
import { useAuth } from '~/composables/useAuth'

export const useBooksStore = defineStore('books', () => {
  const books = ref<Book[]>([])
  const { db } = useFirebase()
  const { user } = useAuth()
  let unsubscribe: (() => void) | null = null

  // Watch for auth changes to sync with Firestore
  watch(user, async (newUser, oldUser) => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }

    if (newUser) {
      // Sync from Firestore
      const q = query(collection(db, 'books'), where('userId', '==', newUser.uid))
      
      // First, migrate local data if Firestore is empty
      const snapshot = await getDocs(q)
      if (snapshot.empty && books.value.length > 0) {
        const batch = writeBatch(db)
        books.value.forEach(book => {
          const bookRef = doc(db, 'books', book.id)
          batch.set(bookRef, { ...book, userId: newUser.uid })
        })
        await batch.commit()
      }

      // Listen for updates
      unsubscribe = onSnapshot(q, (snapshot) => {
        books.value = snapshot.docs.map(doc => {
          const data = doc.data()
          // Remove userId from local state to keep it clean if needed, 
          // but easier to just spread and ignore
          const { userId, ...book } = data
          return book as Book
        })
      })
    } else {
      // If logged out, we rely on persistedstate (localStorage)
      // but maybe we should clear if we want fresh state on next login
      // For now, let it be
    }
  }, { immediate: true })

  // Getters
  const readingBooks = computed(() => books.value.filter(b => b.status === "reading"))
  const droppedBooks = computed(() => books.value.filter(b => b.status === "dropped"))
  const willReadBooks = computed(() => books.value.filter(b => b.status === "will-read"))
  const finishedBooks = computed(() => books.value.filter(b => b.status === "finished"))
  
  const allTags = computed(() => {
    const tags = new Set<string>()
    books.value.forEach(book => book.tags.forEach(tag => tags.add(tag)))
    return Array.from(tags).sort()
  })

  // Actions
  async function addBook(book: Omit<Book, 'id' | 'addedAt' | 'updatedAt' | 'comments'>) {
    const newBook: Book = {
      ...book,
      id: uuidv4(),
      comments: [],
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    if (user.value) {
      await setDoc(doc(db, 'books', newBook.id), { ...newBook, userId: user.value.uid })
    } else {
      books.value.push(newBook)
    }
  }

  async function updateBook(id: string, updates: Partial<Book>) {
    const index = books.value.findIndex(b => b.id === id)
    if (index !== -1) {
      const existingBook = books.value[index]
      if (existingBook) {
        const updatedBook = {
          ...existingBook,
          ...updates,
          id: existingBook.id,
          updatedAt: new Date().toISOString()
        } as Book
        
        if (user.value) {
          await setDoc(doc(db, 'books', id), { ...updatedBook, userId: user.value.uid }, { merge: true })
        } else {
          books.value[index] = updatedBook
        }
      }
    }
  }

  async function deleteBook(id: string) {
    if (user.value) {
      await deleteDoc(doc(db, 'books', id))
    } else {
      books.value = books.value.filter(b => b.id !== id)
    }
  }

  async function addComment(bookId: string, text: string) {
    const book = books.value.find(b => b.id === bookId)
    if (book) {
      const newComment = {
        id: uuidv4(),
        text,
        createdAt: new Date().toISOString()
      }
      
      const updatedComments = [...book.comments, newComment]
      
      if (user.value) {
        await setDoc(doc(db, 'books', bookId), { 
          comments: updatedComments,
          updatedAt: new Date().toISOString()
        }, { merge: true })
      } else {
        book.comments.push(newComment)
        book.updatedAt = new Date().toISOString()
      }
    }
  }

  async function deleteComment(bookId: string, commentId: string) {
    const book = books.value.find(b => b.id === bookId)
    if (book) {
      const updatedComments = book.comments.filter(c => c.id !== commentId)
      
      if (user.value) {
        await setDoc(doc(db, 'books', bookId), { 
          comments: updatedComments,
          updatedAt: new Date().toISOString()
        }, { merge: true })
      } else {
        book.comments = updatedComments
        book.updatedAt = new Date().toISOString()
      }
    }
  }

  return {
    books,
    readingBooks,
    droppedBooks,
    willReadBooks,
    finishedBooks,
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
