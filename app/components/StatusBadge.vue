<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import type { BookStatus } from '~/types/book'

const props = defineProps<{
  status: BookStatus
}>()

const statusConfig = computed(() => {
  switch (props.status) {
    case 'reading':
      return { label: 'Reading', variant: 'default' as const, class: 'bg-green-500 hover:bg-green-600' }
    case 'will-read':
      return { label: 'Will Read', variant: 'secondary' as const, class: 'bg-blue-500 hover:bg-blue-600 text-white' }
    case 'dropped':
      return { label: 'Dropped', variant: 'destructive' as const, class: '' }
  }
})
</script>

<template>
  <Badge :variant="statusConfig.variant" :class="statusConfig.class">
    {{ statusConfig.label }}
  </Badge>
</template>
