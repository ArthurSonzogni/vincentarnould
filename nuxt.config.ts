import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { SITE_URL } from './composables/site.mjs'

// Jeton Cloudflare Web Analytics (public, sans cookie).
// A recuperer dans Cloudflare > Analytics & Logs > Web Analytics.
// Tant qu'il est vide, aucun script de mesure n'est charge.
const CLOUDFLARE_ANALYTICS_TOKEN = '05796ad257d24890a036f33f487010f4'

// Routes des pages dynamiques, lues depuis le frontmatter des fichiers de contenu.
// Sans elles, les fiches produit ne sont pas generees et renvoient une 404.
function contentRoutes(dir: string, prefix: string) {
  return readdirSync(`content/${dir}`)
    .filter(file => file.endsWith('.md'))
    .map(file => readFileSync(`content/${dir}/${file}`, 'utf8').match(/^url:\s*(.+)$/m)?.[1])
    .filter(Boolean)
    .map(url => `${prefix}/${url!.trim().replace(/^["']|["']$/g, '')}`)
}

export default defineNuxtConfig({
  target: 'static',
  ssr: true,
  site: {
    url: 'https://vincentarnould.com',
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        ...contentRoutes('product', '/product'),
        ...contentRoutes('collection', '/collection'),
      ],
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/file_00000000a1a4720aa2ba50819bc1daad-2.png' }
      ],
      meta: [
        // Verification de propriete Google Search Console (methode balise HTML,
        // choisie parce que le DNS du domaine n'est pas administre ici).
        {
          name: 'google-site-verification',
          content: '9xlKfoqTMoN-DfKk1qOtOCtTfVgs86CG5jyzXsLMozs',
        },
      ],
      script: CLOUDFLARE_ANALYTICS_TOKEN
        ? [{
            src: 'https://static.cloudflareinsights.com/beacon.min.js',
            type: 'module',
            'data-cf-beacon': `{"token": "${CLOUDFLARE_ANALYTICS_TOKEN}"}`,
          }]
        : [],
    }
  },
  // @nuxtjs/sitemap 8 est incompatible avec @nuxt/content 3 (il importe
  // "@nuxt/content/server", sous-chemin qui n'existe pas) et fait echouer le
  // build. Le site etant entierement statique, on ecrit les deux fichiers ici.
  hooks: {
    'nitro:build:public-assets'(nitro) {
      const pages = [
        '/',
        '/cgu',
        '/cgv',
        ...contentRoutes('product', '/product'),
        ...contentRoutes('collection', '/collection'),
      ]
      // Le site redirige (301) vers l'URL avec slash final : on liste
      // directement la forme canonique pour eviter un saut de redirection.
      const urls = pages
        .map(page => `  <url><loc>${SITE_URL}${encodeURI(page)}${page === '/' ? '' : '/'}</loc></url>`)
        .join('\n')
      const dir = nitro.options.output.publicDir

      writeFileSync(
        join(dir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n`
        + `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      )
      writeFileSync(
        join(dir, 'robots.txt'),
        `User-agent: *\nAllow: /\nDisallow: /audit\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      )
    },
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
