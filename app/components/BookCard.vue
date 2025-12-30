<script setup lang="ts">
import type { Book } from '~/types/book'
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { MoreVertical, Edit, Trash2, Calendar } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { BOOK_STATUSES } from '~/constants/book'
import type { BookStatus } from '~/types/book'

const props = defineProps<{
  book: Book
}>()

const emit = defineEmits<{
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
  (e: 'update:status', id: string, status: Book['status']): void
}>()

const store = useBooksStore()
const isViewDialogOpen = ref(false)

function handleRatingUpdate(rating: number) {
  store.updateBook(props.book.id, { rating })
}

function handleStatusUpdate(status: BookStatus) {
  store.updateBook(props.book.id, { status })
}
</script>

<template>
  <Card class="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow group">
    <div 
      class="relative aspect-[2/3] w-full bg-muted overflow-hidden cursor-pointer"
      @click="isViewDialogOpen = true"
    >
      <img
        v-if="book.coverUrl"
        :src="book.coverUrl"
        :alt="book.title"
        class="w-full h-full object-cover transition-transform group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
        <span class="text-4xl">📚</span>
      </div>
      
      <div class="absolute top-2 right-2" @click.stop>
        <DropdownMenu>
          <DropdownMenuTrigger class="focus:outline-none">
            <StatusBadge :status="book.status" class="cursor-pointer hover:ring-2 ring-white/50 transition-all shadow-sm" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              v-for="s in BOOK_STATUSES" 
              :key="s.value"
              @select="handleStatusUpdate(s.value)"
              :class="{ 'bg-accent': s.value === book.status }"
            >
              {{ s.label }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <CardHeader class="p-4 pb-2 space-y-1">
      <h3 
        class="font-semibold leading-tight line-clamp-2 cursor-pointer hover:text-primary transition-colors" 
        :title="book.title"
        @click="isViewDialogOpen = true"
      >
        {{ book.title }}
      </h3>
      <p class="text-sm text-muted-foreground line-clamp-1">
        {{ book.author }}
      </p>
    </CardHeader>

    <CardContent class="p-4 pt-1 flex-grow space-y-3">
      <div @click.stop>
        <RatingStars 
          :model-value="book.rating" 
          :size="14" 
          @update:model-value="handleRatingUpdate"
        />
      </div>
      
      <div v-if="book.tags.length > 0" class="flex flex-wrap gap-1">

        <span 
          v-for="tag in book.tags.slice(0, 3)" 
          :key="tag"
          class="text-[10px] bg-secondary px-1.5 py-0.5 rounded-sm text-secondary-foreground"
        >
          #{{ tag }}
        </span>
        <span v-if="book.tags.length > 3" class="text-[10px] text-muted-foreground">
          +{{ book.tags.length - 3 }}
        </span>
      </div>
    </CardContent>

    <CardFooter class="p-4 pt-0 flex justify-between items-center border-t bg-card/50 mt-auto">
      <span class="text-xs text-muted-foreground flex items-center gap-1">
        <Calendar :size="12" />
        {{ new Date(book.addedAt).toLocaleDateString() }}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="h-8 w-8 -mr-2">
            <MoreVertical class="h-4 w-4" />
            <span class="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @select="$emit('edit', book.id)">
            <Edit class="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem @select="$emit('delete', book.id)" class="text-destructive focus:text-destructive">
            <Trash2 class="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardFooter>

    <ViewBookDialog 
      v-model:open="isViewDialogOpen" 
      :book="book" 
      @edit="$emit('edit', book.id)"
    />
  </Card>
</template>

