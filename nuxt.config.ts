// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    baseURL: '/prj-shelfie/',
    head: {
      title: 'Shelfie - Your Personal Online Bookshelf',
      meta: [
        { name: 'description', content: 'Manage your personal library, track reading progress, and discover new books with Shelfie.' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/prj-shelfie/favicon.svg' }
      ]
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['shadcn-nuxt', '@pinia/nuxt', '@nuxtjs/tailwindcss', 'pinia-plugin-persistedstate/nuxt'],
  css: ['~/assets/css/main.css'],
  shadcn: {
    /**
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: 'app/components/ui'
  },
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID
    }
  }
})