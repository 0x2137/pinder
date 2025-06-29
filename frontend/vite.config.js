// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      filename: 'sw.js',
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'manifest.webmanifest',
        'icon-192x192.png',
        'icon-512x512.png'
      ],
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
                ['document', 'script', 'style', 'image', 'font', 'worker']
                    .includes(request.destination),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pinder-runtime-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
        ],
      },

      manifest: {
        name: 'Pinder',
        short_name: 'Pinder',
        start_url: '/',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#000000',
        icons: [
          { src: '/favicon.ico', sizes: '64x64 32x32 24x24 16x16', type: 'image/x-icon' },
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },

      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ]
})
