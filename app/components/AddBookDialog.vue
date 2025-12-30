<script setup lang="ts">
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogFooter,
  DialogTrigger 
} from '~/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '~/components/ui/select'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { Loader2, Search, BookOpen, Plus } from 'lucide-vue-next'
import type { Book, BookStatus } from '~/types/book'
import { imageUrlToBase64 } from '~/lib/utils/image'
import { BOOK_STATUSES } from '~/constants/book'

const props = defineProps<{
  bookId?: string
}>()

const open = ref(false)
const manualMode = ref(false)
const isSubmitting = ref(false)

// Form State
const form = reactive({
  title: '',
  author: '',
  description: '',
  coverUrl: '',
  status: 'reading' as BookStatus,
  rating: 0,
  tags: [] as string[],
  addedAt: new Date().toISOString().split('T')[0]
})

// Store interaction
const store = useBooksStore()

// If bookId is provided, we are in edit mode
const isEditMode = computed(() => !!props.bookId)

watch(() => props.bookId, (newId) => {
  if (newId) {
    const book = store.books.find(b => b.id === newId)
    if (book) {
      form.title = book.title
      form.author = book.author
      form.description = book.description || ''
      form.coverUrl = book.coverUrl || ''
      form.status = book.status
      form.rating = book.rating
      form.tags = [...book.tags]
      form.addedAt = new Date(book.addedAt).toISOString().split('T')[0]
      manualMode.value = true
      open.value = true
    }
  }
}, { immediate: true })

// Search Logic
const { query, results, loading, error } = useBookSearch()
const showResults = ref(false)

watch(results, (newResults) => {
  showResults.value = newResults.length > 0
})

function selectBook(book: any) {
  form.title = book.title
  form.author = book.author
  form.description = book.description || ''
  form.coverUrl = book.coverUrl || ''
  
  query.value = ''
  showResults.value = false
  manualMode.value = true
}

function resetForm() {
  if (isEditMode.value) return // Don't reset if we are just closing the edit dialog via prop change elsewhere
  form.title = ''
  form.author = ''
  form.description = ''
  form.coverUrl = ''
  form.status = 'reading'
  form.rating = 0
  form.tags = []
  form.addedAt = new Date().toISOString().split('T')[0]
  query.value = ''
  manualMode.value = false
  showResults.value = false
}

async function handleSubmit() {
  if (!form.title) return
  
  isSubmitting.value = true
  
  let finalCoverUrl = form.coverUrl
  // Download cover if it's an external URL and not already base64
  if (finalCoverUrl && finalCoverUrl.startsWith('http')) {
    try {
      finalCoverUrl = await imageUrlToBase64(finalCoverUrl)
    } catch (e) {
      console.error('Failed to download cover:', e)
    }
  }

  const bookData = {
    title: form.title,
    author: form.author || 'Unknown',
    description: form.description,
    coverUrl: finalCoverUrl,
    status: form.status,
    rating: form.rating,
    tags: form.tags,
    addedAt: new Date(form.addedAt || Date.now()).toISOString()
  }

  if (isEditMode.value && props.bookId) {
    store.updateBook(props.bookId, bookData)
  } else {
    store.addBook(bookData)
  }
  
  isSubmitting.value = false
  open.value = false
  resetForm()
  
  if (isEditMode.value) {
    emit('close')
  }
}

const emit = defineEmits(['close'])

function handleOpenChange(val: boolean) {
  if (!val) {
    if (isEditMode.value) {
      emit('close')
    } else {
      resetForm()
    }
  }
  open.value = val
}
</script>

<template>
  <Dialog :open="open" @update:open="handleOpenChange">
    <DialogTrigger as-child v-if="!isEditMode">
      <slot>
        <Button>
          <Plus class="mr-2 h-4 w-4" /> Add Book
        </Button>
      </slot>
    </DialogTrigger>
    
    <DialogContent class="!min-h-[80vh] overflow-y-auto auto-rows-max">
      <DialogHeader>
        <DialogTitle>{{ isEditMode ? 'Edit Book' : 'Add New Book' }}</DialogTitle>
        <DialogDescription>
          {{ isEditMode ? 'Update your book details below.' : 'Search specifically from Open Library or enter details manually.' }}
        </DialogDescription>
      </DialogHeader>

      <!-- Search Section (only in add mode) - moved to top -->
      <div v-if="!manualMode && !isEditMode" class="space-y-2 relative pb-4">
        <Label>Find a Book</Label>
        <div class="relative">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            v-model="query"
            placeholder="Search by title, author, ISBN..." 
            class="pl-9"
            autocomplete="off"
          />
          <div v-if="loading" class="absolute right-3 top-3">
            <Loader2 class="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        </div>
        
        <!-- Search Results Dropdown -->
        <div v-if="showResults" class="absolute z-10 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md max-h-[500px] overflow-y-auto">
          <button
            v-for="book in results"
            :key="book.id"
            class="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex gap-3 items-start transition-colors"
            @click="selectBook(book)"
          >
            <div class="w-8 shrink-0 bg-muted aspect-[2/3] rounded overflow-hidden">
              <img v-if="book.coverUrl" :src="book.coverUrl" class="w-full h-full object-cover" />
              <BookOpen v-else class="w-full h-full p-2 text-muted-foreground" />
            </div>
            <div>
              <div class="font-medium line-clamp-1">{{ book.title }}</div>
              <div class="text-muted-foreground text-xs">{{ book.author }}</div>
              <div v-if="book.publishedYear" class="text-xs opacity-70">{{ book.publishedYear }}</div>
            </div>
          </button>
        </div>
        
        <div class="text-center pt-2">
           <Button variant="link" size="sm" @click="manualMode = true" class="text-xs text-muted-foreground">
             Or enter details manually
           </Button>
        </div>
      </div>

      <div class="space-y-6 py-4">
        <!-- Manual Entry Form -->
        <div v-if="manualMode || isEditMode" class="space-y-4 animate-accordion-down">
          <div class="grid grid-cols-4 gap-4 items-start">
             <!-- Cover Preview -->
             <div class="col-span-1">
                <div class="aspect-[2/3] bg-muted rounded-md overflow-hidden flex items-center justify-center border relative group">
                  <img v-if="form.coverUrl" :src="form.coverUrl" class="w-full h-full object-cover" />
                  <span v-else class="text-4xl">📚</span>
                </div>
             </div>
             
             <div class="col-span-3 space-y-3">
               <div class="space-y-1">
                 <Label>Title</Label>
                 <Input v-model="form.title" placeholder="Book Title" />
               </div>
               <div class="space-y-1">
                 <Label>Author</Label>
                 <Input v-model="form.author" placeholder="Author Name" />
               </div>
             </div>
          </div>
          
          <div class="space-y-1">
             <Label>Cover URL (Optional)</Label>
             <Input v-model="form.coverUrl" placeholder="https://..." class="text-xs font-mono" />
          </div>

          <div class="grid grid-cols-2 gap-4">
             <div class="space-y-2">
               <Label>Status</Label>
               <Select v-model="form.status">
                 <SelectTrigger>
                   <SelectValue placeholder="Select Status" />
                 </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="s in BOOK_STATUSES" :key="s.value" :value="s.value">
                      {{ s.label }}
                    </SelectItem>
                  </SelectContent>
               </Select>
             </div>
             
             <div class="space-y-2">
               <Label>Rating</Label>
               <div class="h-10 flex items-center">
                 <RatingStars v-model="form.rating" :size="20" />
               </div>
             </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Added Date</Label>
              <Input v-model="form.addedAt" type="date" />
            </div>
            
            <div class="space-y-2">
              <Label>Tags</Label>
              <TagInput v-model="form.tags" :suggestions="store.allTags" />
            </div>
          </div>

          <div class="space-y-2">
             <Label>Description <span class="text-muted-foreground font-normal text-xs">(Optional)</span></Label>
             <Textarea v-model="form.description" rows="3" class="resize-none" />
          </div>
        </div>
      </div>

      <DialogFooter v-if="manualMode || isEditMode" class="gap-2 sm:justify-between">
        <Button v-if="!isEditMode" variant="ghost" @click="manualMode = false">
           Back to Search
        </Button>
        <div v-else></div> <!-- spacer -->
        <Button @click="handleSubmit" :disabled="!form.title || isSubmitting">
          <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          {{ isEditMode ? 'Update' : 'Save' }} Book
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

