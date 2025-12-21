<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'

const props = defineProps<{
  modelValue: string
  counts: {
    all: number
    reading: number
    'will-read': number
    dropped: number
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <Tabs :model-value="modelValue" class="w-full" @update:model-value="$emit('update:modelValue', $event as string)">
    <TabsList class="grid w-full grid-cols-4 max-w-[600px]">
      <TabsTrigger value="all">
        All <span class="ml-2 text-xs opacity-50">{{ counts.all }}</span>
      </TabsTrigger>
      <TabsTrigger value="reading">
        Reading <span class="ml-2 text-xs opacity-50">{{ counts.reading }}</span>
      </TabsTrigger>
      <TabsTrigger value="will-read">
        Will Read <span class="ml-2 text-xs opacity-50">{{ counts['will-read'] }}</span>
      </TabsTrigger>
      <TabsTrigger value="dropped">
        Dropped <span class="ml-2 text-xs opacity-50">{{ counts.dropped }}</span>
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
