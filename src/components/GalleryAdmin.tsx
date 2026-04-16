import { useState, useEffect } from 'react';
import type { GalleryImage } from '../types/types';
import { supabase } from '../lib/supabase';
import AddImageForm from './ui/AddImageForm';
import { positionClass } from '../lib/imagePosition';

export default function GalleryAdmin() {
  const [images, setImages] = useState<GalleryImage[]>([]);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setImages(data);
  };

  useEffect(() => { fetchImages(); }, []);

  const handleAdd = (image: GalleryImage) => {
    setImages(prev => [image, ...prev]);
  };

  const handleDelete = async (id: number) => {
    await supabase.from('gallery_images').delete().eq('id', id);
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 p-4 h-full overflow-y-auto no-scrollbar">

      <AddImageForm onAdd={handleAdd} />

      {/* Lista de imágenes */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">
          Imágenes ({images.length})
        </h2>
        {images.length === 0 && (
          <p className="text-white/30 text-sm italic">Sin imágenes aún.</p>
        )}
        {images.map(img => (
          <div
            key={img.id}
            className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2"
          >
            <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-white/10">
              <img src={img.src} alt={img.alt} className={`w-full h-full object-cover ${positionClass(img.object_position)}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{img.alt}</p>
              {img.span && (
                <span className="text-xs text-white/40 bg-white/10 rounded px-1.5 py-0.5">
                  {img.span}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleDelete(img.id)}
              className="text-white/30 hover:text-red-400 transition-colors text-lg leading-none shrink-0"
              title="Eliminar"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
