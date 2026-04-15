import { useState, useRef } from 'react';
import type { GalleryImage, GalleryImageInsert, GallerySpan } from '../../types/types';
import { supabase } from '../../lib/supabase';

const SPAN_OPTIONS: { label: string; value: GallerySpan }[] = [
  { label: 'Normal', value: '' },
  { label: 'Alto', value: 'tall' },
  { label: 'Ancho', value: 'wide' },
];

interface Props {
  onAdd: (image: GalleryImage) => void;
}

export default function AddImageForm({ onAdd }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [alt, setAlt] = useState('');
  const [span, setSpan] = useState<GallerySpan>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
    setError(null);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setAlt('');
    setSpan('');
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!file || !alt.trim()) return;
    setLoading(true);
    setError(null);

    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filename, file, { upsert: false });

    if (uploadError) {
      setError('Error al subir la imagen: ' + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(filename);
    const src = urlData.publicUrl;

    const insert: GalleryImageInsert = { src, alt: alt.trim(), span };
    const { data, error: insertError } = await supabase
      .from('gallery_images')
      .insert([insert])
      .select()
      .single();

    if (insertError || !data) {
      setError('Error al guardar: ' + (insertError?.message ?? 'desconocido'));
    } else {
      onAdd(data as GalleryImage);
      reset();
    }
    setLoading(false);
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">
        Agregar imagen
      </h2>

      <div className="flex gap-3">
        {/* Preview / selector */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer"
        >
          {preview
            ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
            : <span className="text-white/30 text-xs text-center px-2 leading-tight">
                Seleccionar<br />imagen
              </span>
          }
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />

        <div className="flex flex-col gap-2 flex-1">
          <input
            type="text"
            placeholder="Descripción (alt)"
            value={alt}
            onChange={e => setAlt(e.target.value)}
            className="bg-white/10 text-white placeholder-white/30 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-white/30"
          />
          <div className="flex gap-2">
            {SPAN_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSpan(opt.value)}
                className={`text-xs px-3 py-1 rounded-lg transition-colors
                  ${span === opt.value
                    ? 'bg-white/20 text-white font-semibold'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || !file || !alt.trim()}
        className="bg-white/15 hover:bg-white/25 disabled:opacity-30 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
      >
        {loading ? 'Subiendo…' : '+ Agregar'}
      </button>
    </div>
  );
}
