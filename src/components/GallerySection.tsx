import { useState, useEffect } from 'react';
import type { GalleryImage } from '../types/types';
import { supabase } from '../lib/supabase';
import { positionClass } from '../lib/imagePosition';

export default function GallerySection() {
  const [photos, setPhotos]   = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('gallery_images')
      .select('id, src, alt, span, object_position, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else if (data) setPhotos(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="text-center py-12 text-bark-dark/30 text-sm">Cargando galería…</div>
  );

  if (error) return (
    <div className="text-center py-12 text-red-400 text-sm">Error: {error}</div>
  );

  if (photos.length === 0) return (
    <div className="text-center py-12 text-bark-dark/30 text-sm italic">Sin imágenes aún.</div>
  );

  return (
    <div className="grid grid-cols-3 max-sm:grid-cols-2 auto-rows-[220px] max-sm:auto-rows-[150px] gap-3">
      {photos.map(photo => (
        <div
          key={photo.id}
          className={[
            'relative overflow-hidden rounded-[10px] cursor-pointer group',
            photo.span === 'tall' ? 'row-span-2' : '',
            photo.span === 'wide' ? 'col-span-2' : '',
          ].filter(Boolean).join(' ')}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            width="800"
            height="600"
            className={`w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500 ${positionClass(photo.object_position)}`}
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
