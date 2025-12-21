<script setup lang="ts">
import { X, Plus } from 'lucide-vue-next'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

const props = defineProps<{
  modelValue: string[]
  suggestions?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const newTag = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function addTag() {
  const tag = newTag.value.trim().toLowerCase()
  if (tag && !props.modelValue.includes(tag)) {
    emit('update:modelValue', [...props.modelValue, tag])
  }
  newTag.value = ''
}

function removeTag(tagToRemove: string) {
  emit('update:modelValue', props.modelValue.filter(tag => tag !== tagToRemove))
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    addTag()
  } else if (e.key === 'Backspace' && !newTag.value && props.modelValue.length > 0) {
    removeTag(props.modelValue[props.modelValue.length - 1])
  }
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex flex-wrap gap-2">
      <Badge 
        v-for="tag in modelValue" 
        :key="tag" 
        variant="secondary"
        class="pl-2 pr-1 py-1 flex items-center gap-1"
      >
        #{{ tag }}
        <button 
          type="button" 
          @click="removeTag(tag)"
          class="hover:bg-muted-foreground/20 rounded-full p-0.5 focus:outline-none focus:ring-1 ring-ring"
        >
          <X :size="12" />
          <span class="sr-only">Remove tag</span>
        </button>
      </Badge>
      
      <div class="relative min-w-[120px]">
        <Input
          ref="inputRef"
          v-model="newTag"
          type="text"
          placeholder="Add tag..."
          class="h-7 text-xs px-2 py-0 focus-visible:ring-1"
          @keydown="handleKeydown"
          @blur="addTag"
        />
<!--        TODO: Add autocomplete suggestions dropdown -->
      </div>
    </div>
    
    <div v-if="suggestions?.length" class="flex flex-wrap gap-1 text-xs text-muted-foreground">
      <span>Suggested:</span>
      <button 
        v-for="tag in suggestions.slice(0, 5)" 
        :key="tag"
        type="button"
        class="hover:text-foreground hover:underline cursor-pointer"
        @click="!modelValue.includes(tag) && emit('update:modelValue', [...modelValue, tag])"
      >
        #{{ tag }}
      </button>
    </div>
  </div>
</template>
