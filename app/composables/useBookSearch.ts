import { refDebounced } from '@vueuse/core'

export interface OpenLibraryBook {
  key: string
  title: string
  author_name?: string[]
  cover_i?: number
  first_publish_year?: number
  subject?: string[]
}

export interface SearchResult {
  id: string
  title: string
  author: string
  coverUrl?: string
  publishedYear?: number
  description?: string
}

export function useBookSearch() {
  const query = ref('')
  const debouncedQuery = refDebounced(query, 300)
  const results = ref<SearchResult[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  watch(debouncedQuery, async (newQuery) => {
    if (!newQuery || newQuery.length < 3) {
      results.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(newQuery)}&limit=10`)
      if (!response.ok) throw new Error('Failed to fetch books')
      
      const data = await response.json()
      results.value = data.docs.map((doc: OpenLibraryBook) => ({
        id: doc.key.replace('/works/', ''),
        title: doc.title,
        author: doc.author_name?.[0] || 'Unknown Author',
        coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined,
        publishedYear: doc.first_publish_year,
        // Open Library search API doesn't return full description usually, need separate fetch for details if needed
        // but for list display we can omit or fetch on selection
      }))
    } catch (e) {
      error.value = 'Error searching books. Please try again.'
      console.error(e)
    } finally {
      loading.value = false
    }
  })

  return {
    query,
    results,
    loading,
    error
  }
}
