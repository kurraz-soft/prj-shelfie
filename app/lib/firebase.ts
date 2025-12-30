import { initializeApp, type FirebaseApp, getApps, getApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

let firebaseApp: FirebaseApp
let firebaseAuth: Auth
let firebaseDb: Firestore

export const useFirebase = () => {
  const config = useRuntimeConfig()

  if (!firebaseApp) {
    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey as string,
      authDomain: config.public.firebaseAuthDomain as string,
      projectId: config.public.firebaseProjectId as string,
      storageBucket: config.public.firebaseStorageBucket as string,
      messagingSenderId: config.public.firebaseMessagingSenderId as string,
      appId: config.public.firebaseAppId as string,
    }

    // Initialize Firebase only if no apps exist
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    firebaseAuth = getAuth(firebaseApp)
    firebaseDb = getFirestore(firebaseApp)
  }

  return {
    app: firebaseApp,
    auth: firebaseAuth,
    db: firebaseDb,
  }
}
