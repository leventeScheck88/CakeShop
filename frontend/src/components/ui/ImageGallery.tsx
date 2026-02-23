import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fallbackSrc =
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect fill="%23F8E8E0" width="600" height="600"/><text x="300" y="300" text-anchor="middle" fill="%23C9A96E" font-size="72">🎂</text></svg>';

  const getUrl = (path: string) => (path ? `${API_URL}${path}` : fallbackSrc);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-blush rounded-lg flex items-center justify-center">
        <span className="text-6xl">🎂</span>
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-lg bg-blush">
        <img
          src={getUrl(images[selectedIndex])}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackSrc;
          }}
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                index === selectedIndex ? 'border-gold' : 'border-transparent'
              }`}
            >
              <img
                src={getUrl(image)}
                alt={`${alt} ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackSrc;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
