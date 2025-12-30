<script setup lang="ts">
import { 
  Dialog, DialogContent, 
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Calendar, Tag, BookOpen, Quote, Edit2, X, MessageSquare, Send, Trash2 } from 'lucide-vue-next'
import type { Book } from '~/types/book'

const props = defineProps<{
  book: Book
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'edit'): void
}>()

const store = useBooksStore()
const newComment = ref('')

function toggleOpen(value: boolean) {
  emit('update:open', value)
}

function handleEdit() {
  toggleOpen(false)
  emit('edit')
}

function handleAddComment() {
  if (!newComment.value.trim()) return
  store.addComment(props.book.id, newComment.value.trim())
  newComment.value = ''
}

function handleDeleteComment(commentId: string) {
  store.deleteComment(props.book.id, commentId)
}
</script>

<template>
  <Dialog :open="open" @update:open="toggleOpen">
    <DialogContent class="max-w-4xl overflow-hidden p-0 gap-0 border-none bg-background shadow-2xl">
      <div class="flex flex-col md:flex-row h-full max-h-[90vh]">
        <!-- Left: Cover Image (Static) -->
        <div class="md:w-[320px] shrink-0 bg-muted relative overflow-hidden group">
          <img 
            v-if="book.coverUrl" 
            :src="book.coverUrl" 
            :alt="book.title" 
            class="w-full h-full object-cover shadow-2xl transition-transform duration-700 group-hover:scale-105"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-secondary/30">
            <BookOpen class="w-24 h-24 text-muted-foreground/20" />
          </div>
          
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
          
          <div class="absolute top-4 left-4">
            <StatusBadge :status="book.status" />
          </div>
          
          <div class="absolute bottom-6 left-6 right-6 text-white hidden md:block">
            <RatingStars :model-value="book.rating" readonly :size="20" color="white" />
            <p class="text-xs mt-2 opacity-80 flex items-center gap-1.5">
              <Calendar :size="12" />
              Added {{ new Date(book.addedAt).toLocaleDateString() }}
            </p>
          </div>
        </div>

        <!-- Right: Scrollable Content -->
        <div class="flex-grow flex flex-col min-w-0 bg-card">
          <div class="p-8 flex-grow overflow-y-auto space-y-8 custom-scrollbar">
            <!-- Header -->
            <div class="space-y-2">
              <h2 class="text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                {{ book.title }}
              </h2>
              <p class="text-xl text-muted-foreground font-medium italic">
                by {{ book.author }}
              </p>
            </div>

            <!-- Tags -->
            <div v-if="book.tags.length" class="flex flex-wrap gap-2">
              <span 
                v-for="tag in book.tags" 
                :key="tag"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold border border-primary/20"
              >
                <Tag :size="12" />
                {{ tag }}
              </span>
            </div>

            <!-- Description -->
            <div class="space-y-4">
              <div class="flex items-center gap-2 text-sm font-bold text-foreground/80 tracking-widest uppercase">
                 <Quote :size="16" class="text-primary" />
                 About this book
              </div>
              <div class="relative pl-4 border-l-2 border-primary/20">
                <p v-if="book.description" class="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {{ book.description }}
                </p>
                <p v-else class="text-sm italic text-muted-foreground/60">
                  No description available for this title.
                </p>
              </div>
            </div>

            <!-- Comments Section -->
            <div class="space-y-4 pt-4 border-t border-border/40">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-sm font-bold text-foreground/80 tracking-widest uppercase">
                  <MessageSquare :size="16" class="text-primary" />
                  Your Notes
                </div>
                <span class="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {{ book.comments.length }}
                </span>
              </div>

              <!-- Comment List -->
              <div class="space-y-3">
                <div 
                  v-for="comment in book.comments" 
                  :key="comment.id"
                  class="group relative bg-muted/30 hover:bg-muted/50 p-3 rounded-lg border border-border/50 transition-colors"
                >
                  <p class="text-sm text-foreground/90 pr-8">{{ comment.text }}</p>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-[10px] text-muted-foreground/70">
                      {{ new Date(comment.createdAt).toLocaleString() }}
                    </span>
                    <button 
                      @click="handleDeleteComment(comment.id)"
                      class="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 :size="12" />
                    </button>
                  </div>
                </div>

                <!-- Add Comment Form -->
                <div class="flex gap-2 mt-4">
                  <Input 
                    v-model="newComment" 
                    placeholder="Add a note or comment..." 
                    class="h-9 text-sm bg-muted/20"
                    @keyup.enter="handleAddComment"
                  />
                  <Button size="sm" class="shrink-0 h-9 px-3" @click="handleAddComment">
                    <Send :size="14" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 bg-muted/30 border-t border-border/50 flex justify-between items-center shrink-0">
            <Button variant="ghost" size="sm" @click="toggleOpen(false)" class="text-muted-foreground hover:text-foreground">
              Close
            </Button>
            <Button @click="handleEdit" class="gap-2 shadow-lg shadow-primary/20">
              <Edit2 :size="16" />
              Edit Book
            </Button>
          </div>
        </div>
        
        <!-- Close button for mobile -->
        <button 
          @click="toggleOpen(false)"
          class="absolute right-4 top-4 rounded-full p-2 bg-black/20 hover:bg-black/40 text-white md:hidden backdrop-blur-sm transition-colors z-50"
        >
          <X :size="20" />
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.15);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.3);
}
</style>


