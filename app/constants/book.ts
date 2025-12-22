import type { BookStatus } from '~/types/book'

export interface StatusConfig {
  value: BookStatus
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  class: string
}

export const BOOK_STATUSES: StatusConfig[] = [
  { 
    value: 'reading', 
    label: 'Reading', 
    variant: 'default', 
    class: 'bg-green-500 hover:bg-green-600' 
  },
  { 
    value: 'will-read', 
    label: 'Will Read', 
    variant: 'secondary', 
    class: 'bg-blue-500 hover:bg-blue-600 text-white' 
  },
  { 
    value: 'finished', 
    label: 'Finished', 
    variant: 'default', 
    class: 'bg-amber-500 hover:bg-amber-600' 
  },
  { 
    value: 'dropped', 
    label: 'Dropped', 
    variant: 'destructive', 
    class: '' 
  }
]

export const ALL_TABS = [
  { value: 'all', label: 'All' },
  ...BOOK_STATUSES.map(s => ({ value: s.value, label: s.label }))
]
