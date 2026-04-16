import { useState, useRef } from 'react';
import type { GalleryImage, GalleryImageInsert, GallerySpan } from '../../types/types';
import { supabase } from '../../lib/supabase';
import ImageCropper from './ImageCropper';
import { type ObjectPosition, ALL_POSITIONS as POSITIONS, positionClass } from '../../lib/imagePosition';

export { positionClass };

const SPAN_OPTIONS: { label: string; value: GallerySpan }[] = [
  { label: 'Normal', value: '' },
  { label: 'Alto',   value: 'tall' },
  { label: 'Ancho',  value: 'wide' },
];

/* Aspect ratio según el span elegido */
function spanAspect(span: GallerySpan): number {
  if (span === 'tall') return 3 / 4;
  if (span === 'wide') return 16 / 9;
  return 4 / 3;
}

interface Props {
  onAdd: (image: GalleryImage) => void;
}

export default function AddImageForm({ onAdd }: Props) {
  const [file, setFile]           = useState<File | null>(null);
  const [preview, setPreview]     = useState<string | null>(null);
  const [cropSrc, setCropSrc]     = useState<string | null>(null);
  const [alt, setAlt]             = useState('');
  const [span, setSpan]           = useState<GallerySpan>('');
  const [objectPos, setObjectPos] = useState<ObjectPosition>('center');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (!selected) return;
    setCropSrc(URL.createObjectURL(selected));
    setError(null);
  };

  const handleCropConfirm = (blob: Blob) => {
    const croppedFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    setFile(croppedFile);
    setPreview(URL.createObjectURL(blob));
    setObjectPos('center');
    setCropSrc(null);
  };

  const handleCropCancel = () => {
    setCropSrc(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setCropSrc(null);
    setAlt('');
    setSpan('');
    setObjectPos('center');
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

    const insert: GalleryImageInsert = { src, alt: alt.trim(), span, object_position: objectPos };
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

  const currentCls = positionClass(objectPos);

  return (
    <>
      {/* Cropper pantalla completa */}
      {cropSrc && (
        <ImageCropper
          src={cropSrc}
          aspect={spanAspect(span)}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

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
              ? <img src={preview} alt="preview" className={`w-full h-full object-cover ${currentCls}`} />
              : <span className="text-white/30 text-xs text-center px-2 leading-tight">
                  Seleccionar<br />imagen
                </span>
            }
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            title="Seleccionar imagen"
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

        {/* Focal point — solo cuando hay imagen */}
        {preview && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40 shrink-0">Encuadre</span>
            <div className="grid grid-cols-3 gap-1">
              {POSITIONS.map(pos => (
                <button
                  key={pos.value}
                  type="button"
                  title={pos.value}
                  onClick={() => setObjectPos(pos.value)}
                  className={`w-5 h-5 rounded-sm transition-colors
                    ${objectPos === pos.value
                      ? 'bg-white/80 ring-1 ring-white'
                      : 'bg-white/15 hover:bg-white/35'
                    }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs text-white/30 hover:text-white/60 transition-colors ml-auto"
            >
              Recortar de nuevo
            </button>
          </div>
        )}

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !file || !alt.trim()}
          className="bg-white/15 hover:bg-white/25 disabled:opacity-30 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          {loading ? 'Subiendo…' : '+ Agregar'}
        </button>
      </div>
    </>
  );
}
