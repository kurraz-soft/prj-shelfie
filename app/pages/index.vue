<script setup lang="ts">
import { useBooksStore } from '~/stores/books'

const store = useBooksStore()
const currentTab = ref('all')
const editingBookId = ref<string | null>(null)

const filteredBooks = computed(() => {
  switch (currentTab.value) {
    case 'reading': return store.readingBooks
    case 'will-read': return store.willReadBooks
    case 'dropped': return store.droppedBooks
    default: return store.books
  }
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
               <h3 class="font-semibold text-lg">No books found</h3>
               <p class="text-muted-foreground text-sm max-w-sm mx-auto">
                 You haven't added any books to this category yet. Start managing your library today!
               </p>
               <AddBookDialog />
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
