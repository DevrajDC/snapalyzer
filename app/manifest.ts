import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';
export default function manifest(): MetadataRoute.Manifest
{
  return {
    name: siteConfig.name,
    short_name: 'Snapalyzer',
    description: siteConfig.description,
    icons: [
      {
        src: '/favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon'
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    start_url: '/',
    theme_color: '#4F46E5',
    background_color: '#000000',
    display: 'standalone',
  };
}