import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hridayam Hope Foundation',
    short_name: 'Hridayam Hope',
    description:
      'Non-profit NGO in Andhra Pradesh serving humanity through education, health, and community empowerment.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4886CF',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logo.webp',
        sizes: '512x512',
        type: 'image/webp',
      },
    ],
  };
}
