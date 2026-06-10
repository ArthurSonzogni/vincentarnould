export default defineNuxtConfig({
  target: 'static',
  ssr: false,
  site: {
    url: 'https://vincentarnould.com',
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/file_00000000a1a4720aa2ba50819bc1daad-2.png' }
      ]
    }
  },
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxt/eslint',
  ],
  ogImage: {
    enabled: false,
  },
  css: ['assets/css/main.css'],
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3, // include h3 headings
        },
        highlight: {
          // Theme used in all color schemes.
          theme: 'github-light',
        }
      }
    },
    preview: {
      api: 'https://api.nuxt.studio',
    },
  },
  ui: {
    colorMode: false,
  },
})
