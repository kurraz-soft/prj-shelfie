<script setup lang="ts">
import { Library } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

defineProps<{
  // Add props if needed in future
}>()
</script>

<template>
  <header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
    <div class="container h-16 flex items-center justify-between">
      <div class="flex items-center gap-2 font-bold text-xl">
        <div class="h-8 w-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
          <Library class="h-5 w-5" />
        </div>
        Shelfie
      </div>
      
      <div class="flex items-center gap-4">
        <AddBookDialog />
      </div>
    </div>
  </header>
</template>
