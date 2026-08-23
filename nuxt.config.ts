import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2026-04-28',
  devtools: { enabled: true },

  modules: ['@nuxt/content', '@nuxt/ui'],
  css: ['~/assets/css/main.css'],

  app: {
    // GitHub Pages serves a project site from /<repo>/. CI sets this; locally
    // it stays '/' so `pnpm dev` works with no extra config.
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: 'favicon.png' }],
    },
  },

  // Fully static output — no server routes, so it deploys to GitHub Pages.
  nitro: {
    preset: 'github-pages',
    // Serve the repo's existing notebooks/ folder as-is rather than duplicating
    // the .ipynb files into public/. The folder stays browsable on GitHub and
    // remains the single source of truth.
    publicAssets: [
      {
        dir: fileURLToPath(new URL('./notebooks', import.meta.url)),
        baseURL: '/notebooks',
      },
    ],
    prerender: { crawlLinks: true, routes: ['/', '/404.html'] },
  },
})
