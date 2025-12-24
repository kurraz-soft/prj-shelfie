<script setup lang="ts">
import { computed } from 'vue'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '~/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Button } from '~/components/ui/button'
import { ChevronDown } from 'lucide-vue-next'
import { ALL_TABS } from '~/constants/book'

const props = defineProps<{
  modelValue: string
  counts: Record<string, number>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const currentTab = computed(() => ALL_TABS.find(tab => tab.value === props.modelValue) || ALL_TABS[0])
</script>

<template>
  <!-- Desktop: Tabs -->
  <div class="hidden md:block">
    <Tabs :model-value="modelValue" class="w-full" @update:model-value="$emit('update:modelValue', $event as string)">
      <TabsList :class="`grid w-full max-w-[700px]`" :style="{ gridTemplateColumns: `repeat(${ALL_TABS.length}, minmax(0, 1fr))` }">
        <TabsTrigger v-for="tab in ALL_TABS" :key="tab.value" :value="tab.value">
          {{ tab.label }} <span class="ml-2 text-xs opacity-50">{{ counts[tab.value] || 0 }}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </div>

  <!-- Mobile: Dropdown -->
  <div class="md:hidden">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" class="w-full max-w-[700px] justify-between">
          <span>{{ currentTab?.label || 'All' }} <span class="ml-2 text-xs opacity-50">({{ counts[currentTab?.value || 'all'] || 0 }})</span></span>
          <ChevronDown class="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-full max-w-[700px]">
        <DropdownMenuItem 
          v-for="tab in ALL_TABS" 
          :key="tab.value"
          @click="$emit('update:modelValue', tab.value)"
          :class="{ 'bg-accent': tab.value === modelValue }"
        >
          {{ tab.label }}
          <span class="ml-auto text-xs opacity-50">{{ counts[tab.value] || 0 }}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
