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
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
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
})