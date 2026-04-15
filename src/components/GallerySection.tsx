import { useState, useEffect } from 'react';
import type { GalleryImage } from '../types/types';
import { supabase } from '../lib/supabase';

export default function GallerySection() {
  const [photos, setPhotos] = useState<GalleryImage[]>([]);

  useEffect(() => {
    supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setPhotos(data); });
  }, []);

  if (photos.length === 0) return null;

  return (
    <div className="grid grid-cols-3 max-sm:grid-cols-2 auto-rows-[220px] max-sm:auto-rows-[150px] gap-3">
      {photos.map(photo => (
        <div
          key={photo.id}
          className={[
            'relative overflow-hidden rounded-[10px] cursor-pointer group',
            photo.span === 'tall' ? 'row-span-2' : '',
            photo.span === 'wide' ? 'col-span-2 max-sm:col-span-2' : '',
          ].filter(Boolean).join(' ')}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            width="800"
            height="600"
            className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-bark-dark/70 to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300
                          flex items-end p-4">
            <span className="font-ui text-[0.82rem] font-semibold text-white tracking-[0.04em]">
              {photo.alt}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
