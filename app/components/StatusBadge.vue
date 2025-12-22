<script setup lang="ts">
import { Badge } from '~/components/ui/badge'
import type { BookStatus } from '~/types/book'
import { BOOK_STATUSES } from '~/constants/book'

const props = defineProps<{
  status: BookStatus
}>()

const statusConfig = computed(() => {
  return BOOK_STATUSES.find(s => s.value === props.status)!
})
</script>

<template>
  <Badge :variant="statusConfig.variant" :class="statusConfig.class">
    {{ statusConfig.label }}
  </Badge>
</template>
