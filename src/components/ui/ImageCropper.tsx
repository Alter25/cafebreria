import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';

interface Props {
  src: string;
  aspect?: number;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}

const MAX_PX = 1200;

async function cropImageToBlob(src: string, pixelCrop: Area): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const scale = Math.min(1, MAX_PX / Math.max(pixelCrop.width, pixelCrop.height));
      const outW  = Math.round(pixelCrop.width  * scale);
      const outH  = Math.round(pixelCrop.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width  = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('no ctx'));
      ctx.drawImage(
        img,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, outW, outH,
      );
      canvas.toBlob(b => b ? resolve(b) : reject(new Error('blob null')), 'image/jpeg', 0.85);
    };
    img.onerror = reject;
    img.src = src;
  });
}

export default function ImageCropper({ src, aspect = 4 / 3, onConfirm, onCancel }: Props) {
  const [crop, setCrop]                     = useState({ x: 0, y: 0 });
  const [zoom, setZoom]                     = useState(1);
  const [croppedArea, setCroppedArea]       = useState<Area | null>(null);
  const [loading, setLoading]               = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedArea(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedArea) return;
    setLoading(true);
    const blob = await cropImageToBlob(src, croppedArea);
    onConfirm(blob);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">

      {/* Área de recorte */}
      <div className="relative flex-1">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          showGrid={false}
          style={{
            containerStyle: { background: 'transparent' },
            cropAreaStyle: { borderRadius: 8, border: '2px solid rgba(255,255,255,0.7)' },
          }}
        />
      </div>

      {/* Controles */}
      <div className="shrink-0 bg-black/80 backdrop-blur-sm px-6 py-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-xs w-8">−</span>
          <input
            type="range"
            title="Zoom"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="flex-1 accent-white h-1 cursor-pointer"
          />
          <span className="text-white/50 text-xs w-8 text-right">+</span>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-white text-black hover:bg-white/90 disabled:opacity-40 transition-colors"
          >
            {loading ? 'Procesando…' : 'Recortar'}
          </button>
        </div>
      </div>

    </div>
  );
}
