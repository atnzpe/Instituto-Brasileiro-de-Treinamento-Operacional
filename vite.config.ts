import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    // Offline first + installable app (issue #9). The service worker only
    // precaches this site's own build files (HTML, JS, CSS, images, icons):
    // never form answers, the contact endpoint or third-party files (VLibras,
    // Google Fonts), which just stay unavailable offline.
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      // The manifest is fetched without credentials by default, which gets a
      // 401 on the password-protected staging site and blocks installing.
      useCredentials: true,
      manifest: {
        name: 'Instituto Brasileiro de Treinamento Operacional',
        short_name: 'IBTO',
        description:
          'Formação operacional de alto nível para civis, profissionais de segurança, policiais e militares.',
        lang: 'pt-BR',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#0a0a0a',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Downloaded on the first visit: only what every page needs, so a
        // phone on mobile data doesn't pull 2 MB of photos up front.
        // Ícones: só os pequenos (192 px e o do iPhone). Os de 512 px (≈ 340 KB juntos)
        // são baixados pelo celular apenas na hora de instalar o app (16/10/2026).
        globPatterns: [
          '**/*.{html,js,css,ico}',
          'icons/icon-192.png',
          'icons/apple-touch-icon.png',
          'images/logo.webp',
        ],
        // Other photos are kept as the visitor sees them (own site only).
        runtimeCaching: [
          {
            urlPattern: ({ request, sameOrigin }) => sameOrigin && request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'ibto-imagens',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // Blog, eventos e cursos (#61, B4): os dados públicos da plataforma de
          // cursos (outro endereço). NetworkFirst = tenta a internet primeiro (o
          // conteúdo novo aparece na hora); se ela falhar ou demorar mais de
          // 4 segundos, usa a última resposta guardada. Assim, quem já abriu um
          // post lê de novo mesmo sem sinal (offline first).
          {
            urlPattern: ({ url }) =>
              /^cursos(-homolog)?\.ib-to\.org$/.test(url.hostname) && url.pathname.startsWith('/api/publico/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ibto-conteudo-plataforma',
              networkTimeoutSeconds: 4,
              // Guarda só respostas de sucesso (200): erro nunca vira "conteúdo".
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
          // Capas e fotos da plataforma (/imagens/...): CacheFirst = depois da
          // primeira vez, abrem do aparelho, sem gastar dados móveis.
          {
            urlPattern: ({ url }) =>
              /^cursos(-homolog)?\.ib-to\.org$/.test(url.hostname) && url.pathname.startsWith('/imagens/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'ibto-imagens-plataforma',
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 * 30, purgeOnQuotaError: true },
            },
          },
        ],
        // Every page is the same index.html (SPA); PHP and API calls always
        // go to the network so the form never gets a cached answer.
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /\.php$/],
        // A new deploy takes over at once: the next page load is the new version.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
