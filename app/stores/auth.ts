import { defineStore } from 'pinia'
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth'
import { useFirebase } from '~/lib/firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const { auth } = useFirebase()

  // Initialize listener
  if (process.client) {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser as User | null
      loading.value = false
    })
  }

  const login = async () => {
    loading.value = true
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      user.value = result.user
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await signOut(auth)
      user.value = null
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: computed(() => !!user.value)
  }
})
