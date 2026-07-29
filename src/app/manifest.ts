import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kolmari — Build Your Relocation Plan',
    short_name: 'Kolmari',
    description: 'Compare destinations, review pathways, and build a practical relocation plan.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D1B39',
    theme_color: '#F3C516',
    icons: [
      { src: '/brand/app-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/brand/app-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
