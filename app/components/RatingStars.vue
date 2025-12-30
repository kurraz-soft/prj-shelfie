<script setup lang="ts">
import { Star } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  modelValue: number
  readonly?: boolean
  size?: number
  color?: string
}>(), {
  modelValue: 0,
  readonly: false,
  size: 16,
  color: undefined
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const hoverValue = ref(0)

function handleMouseEnter(star: number) {
  if (props.readonly) return
  hoverValue.value = star
}

function handleMouseLeave() {
  if (props.readonly) return
  hoverValue.value = 0
}

function handleClick(star: number) {
  if (props.readonly) return
  emit('update:modelValue', star)
}
</script>

<template>
  <div class="flex items-center gap-0.5" @mouseleave="handleMouseLeave">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      :class="[
        'transition-colors focus:outline-none focus-visible:ring-2 ring-ring rounded-sm',
        readonly ? 'cursor-default' : 'cursor-pointer'
      ]"
      :disabled="readonly"
      @mouseenter="handleMouseEnter(star)"
      @click="handleClick(star)"
    >
      <Star
        :size="size"
        :class="[
          'transition-all',
          (hoverValue ? star <= hoverValue : star <= modelValue) 
            ? 'fill-yellow-400 text-yellow-400' 
            : (color ? `text-${color}` : 'text-muted-foreground'),
          (hoverValue ? star <= hoverValue : star <= modelValue) 
            ? '' 
            : 'fill-transparent'
        ]"
      />
    </button>
  </div>
</template>

