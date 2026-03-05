interface LoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function myImageLoader({ src, width, quality }: LoaderProps) {
  // Check if the URL is already absolute (e.g., from CloudFront)
  if (src.startsWith('http')) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }
  
  const IMAGES_OPTIMIZER_URL = process.env.NEXT_PUBLIC_IMAGE_OPTIMIZER_URL || 'https://images.hridayam.org';
  
  return `${IMAGES_OPTIMIZER_URL}/?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
