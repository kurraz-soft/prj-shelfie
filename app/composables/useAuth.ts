import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()
  const { user, loading, isAuthenticated } = storeToRefs(authStore)
  
  return {
    user,
    loading,
    login: authStore.login,
    logout: authStore.logout,
    isAuthenticated
  }
}
