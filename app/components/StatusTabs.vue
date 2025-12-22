<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { ALL_TABS } from '~/constants/book'

const props = defineProps<{
  modelValue: string
  counts: Record<string, number>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <Tabs :model-value="modelValue" class="w-full" @update:model-value="$emit('update:modelValue', $event as string)">
    <TabsList :class="`grid w-full max-w-[700px]`" :style="{ gridTemplateColumns: `repeat(${ALL_TABS.length}, minmax(0, 1fr))` }">
      <TabsTrigger v-for="tab in ALL_TABS" :key="tab.value" :value="tab.value">
        {{ tab.label }} <span class="ml-2 text-xs opacity-50">{{ counts[tab.value] || 0 }}</span>
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
