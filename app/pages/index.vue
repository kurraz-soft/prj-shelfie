<script setup lang="ts">
import { useBooksStore } from '~/stores/books'
import { Search, ArrowUpDown } from 'lucide-vue-next'

const store = useBooksStore()
const currentTab = ref('all')
const editingBookId = ref<string | null>(null)
const searchQuery = ref('')
const sortBy = ref('date-desc')

const filteredBooks = computed(() => {
  let books = []
  switch (currentTab.value) {
    case 'reading': 
      books = [...store.readingBooks]
      break
    case 'will-read': 
      books = [...store.willReadBooks]
      break
    case 'dropped': 
      books = [...store.droppedBooks]
      break
    default: 
      books = [...store.books]
  }

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    if (query.startsWith('#')) {
      const tagQuery = query.substring(1)
      books = books.filter(book => 
        book.tags.some(tag => tag.toLowerCase().includes(tagQuery))
      )
    } else {
      books = books.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      )
    }
  }

  // Sort
  books.sort((a, b) => {
    switch (sortBy.value) {
      case 'title-asc':
        return a.title.localeCompare(b.title)
      case 'title-desc':
        return b.title.localeCompare(a.title)
      case 'date-asc':
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
      case 'date-desc':
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      default:
        return 0
    }
  })

  return books
})

const counts = computed(() => ({
  all: store.books.length,
  reading: store.readingBooks.length,
  'will-read': store.willReadBooks.length,
  dropped: store.droppedBooks.length
}))

function handleDelete(id: string) {
  if (confirm('Are you sure you want to delete this book?')) {
    store.deleteBook(id)
  }
}

function handleEdit(id: string) {
  editingBookId.value = id
}
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased">
    <AppHeader />
    
    <main class="container py-8 space-y-8">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
           <h1 class="text-3xl font-bold tracking-tight">Your Library</h1>
           <p class="text-muted-foreground">Manage your reading journey.</p>
        </div>
        
        <div class="flex items-center gap-4">
          <StatusTabs 
            v-model="currentTab" 
            :counts="counts"
          />
          <AddBookDialog />
        </div>
      </div>

      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div class="relative w-full sm:max-w-xs">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            v-model="searchQuery"
            placeholder="Search title, author or #tag..."
            class="pl-9"
          />
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-muted-foreground whitespace-nowrap flex items-center gap-1">
            <ArrowUpDown class="h-3.5 w-3.5" />
            Sort by:
          </span>
          <Select v-model="sortBy">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Date Added (Newest)</SelectItem>
              <SelectItem value="date-asc">Date Added (Oldest)</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <BookList 
        :books="filteredBooks" 
        @delete="handleDelete"
        @edit="handleEdit"
      >
        <template #empty>
          <div class="flex flex-col items-center justify-center py-16 space-y-4 text-center border-2 border-dashed rounded-xl">
             <div class="p-4 bg-muted rounded-full">
               <span class="text-4xl">📚</span>
             </div>
             <div class="space-y-2">
               <h3 class="font-semibold text-lg">{{ searchQuery ? 'No matching books' : 'No books found' }}</h3>
               <p class="text-muted-foreground text-sm max-w-sm mx-auto">
                 {{ searchQuery 
                  ? "We couldn't find any books matching your search. Try different keywords." 
                  : "You haven't added any books to this category yet. Start managing your library today!" 
                 }}
               </p>
               <AddBookDialog v-if="!searchQuery" />
               <Button v-else variant="outline" @click="searchQuery = ''">Clear search</Button>
             </div>
          </div>
        </template>
      </BookList>

      <!-- Edit Dialog -->
      <AddBookDialog 
        v-if="editingBookId" 
        :book-id="editingBookId" 
        @close="editingBookId = null" 
      />
    </main>
  </div>
</template>
