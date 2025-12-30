<script setup lang="ts">
import { Library, LogOut, User as UserIcon } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useAuth } from '~/composables/useAuth'

const { user, login, logout, loading } = useAuth()
</script>

<template>
  <header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 top-0 z-50">
    <div class="container h-16 flex items-center justify-between">
      <div class="flex items-center gap-2 font-bold text-xl">
        <div class="h-8 w-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
          <Library class="h-5 w-5" />
        </div>
        Shelfie
      </div>
      
      <div class="flex items-center gap-4">
        
        <div v-if="!loading">
          <Button v-if="!user" variant="outline" @click="login">
            Sign In
          </Button>
          
          <DropdownMenu v-else>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="relative h-8 w-8 rounded-full">
                <Avatar class="h-8 w-8">
                  <AvatarImage :src="user.photoURL ?? ''" :alt="user.displayName ?? ''" />
                  <AvatarFallback>{{ user.displayName?.charAt(0) ?? 'U' }}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56" align="end">
              <DropdownMenuLabel class="font-normal">
                <div class="flex flex-col space-y-1">
                  <p class="text-sm font-medium leading-none">{{ user.displayName }}</p>
                  <p class="text-xs leading-none text-muted-foreground">
                    {{ user.email }}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="logout" class="text-destructive focus:text-destructive">
                <LogOut class="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </header>
</template>
