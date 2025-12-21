<script setup lang="ts">
import type { Book } from '~/types/book'

defineProps<{
  books: Book[]
}>()

const emit = defineEmits<{
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div v-if="books.length === 0" class="col-span-full text-center py-12 text-muted-foreground">
    <slot name="empty">
      <p>No books found.</p>
    </slot>
  </div>
  
  <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
    <BookCard
      v-for="book in books"
      :key="book.id"
      :book="book"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>
