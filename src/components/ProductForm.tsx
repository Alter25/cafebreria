import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
import type { Product, ProductInsert } from "../types/types";
import Switch from "./ui/Switch";
import { X, Upload } from "lucide-react";
import { supabase } from '../lib/supabase';
import ImageCropper from './ui/ImageCropper';

const CATEGORIES = [
  { label: 'Bebida',  value: 'bebida'  },
  { label: 'Comida',  value: 'comida'  },
  { label: 'Lectura', value: 'lectura' },
] as const;

const emptyProduct: ProductInsert = {
  name: "",
  price: 0,
  is_active: false,
  description: "",
  category: "bebida",
  img_url: null,
};

interface Props {
  onSave: () => void;
}

export interface ProductFormHandle {
  open: (product?: Product) => void;
}

const ProductForm = forwardRef<ProductFormHandle, Props>(({ onSave }, ref) => {
  const dialogRef  = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editId, setEditId]             = useState<number | null>(null);
  const [form, setForm]                 = useState<ProductInsert>(emptyProduct);
  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cropSrc, setCropSrc]           = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    open: (product?: Product) => {
      if (product) {
        const { id, created_at, ...rest } = product;
        setEditId(id);
        setForm(rest);
        setImagePreview(product.img_url ?? null);
      } else {
        setEditId(null);
        setForm(emptyProduct);
        setImagePreview(null);
      }
      setImageFile(null);
      setError(null);
      dialogRef.current?.showModal();
    },
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price'
        ? Number(value)
        : name === 'category'
          ? value as Product['category']
          : value || null,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    dialogRef.current?.close();
    setCropSrc(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleCropConfirm = (blob: Blob) => {
    const croppedFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    setImageFile(croppedFile);
    setImagePreview(URL.createObjectURL(blob));
    setCropSrc(null);
    dialogRef.current?.showModal();
  };

  const handleCropCancel = () => {
    setCropSrc(null);
    dialogRef.current?.showModal();
  };

  const handleSubmit = async () => {
    if (!form.name?.trim()) return;
    setLoading(true);
    setError(null);

    let img_url = form.img_url ?? null;

    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filename, imageFile, { upsert: false });
      if (uploadError) {
        setError('Error al subir imagen: ' + uploadError.message);
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('products').getPublicUrl(filename);
      img_url = urlData.publicUrl;
    }

    const payload = { ...form, img_url };
    const { error: dbError } = editId
      ? await supabase.from('products').update(payload).eq('id', editId)
      : await supabase.from('products').insert([payload]);

    if (dbError) {
      setError('Error al guardar: ' + dbError.message);
    } else {
      onSave();
      dialogRef.current?.close();
    }
    setLoading(false);
  };

  return (
    <>
    {cropSrc && (
      <ImageCropper
        src={cropSrc}
        aspect={1}
        onConfirm={handleCropConfirm}
        onCancel={handleCropCancel}
      />
    )}
    <dialog
      ref={dialogRef}
      className="not-open:hidden bg-blue-mirage text-white rounded-xl backdrop:bg-black/60 w-85 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 shadow-2xl border border-white/10"
    >
      <div className="flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-white">
            {editId ? form.name : 'Nuevo producto'}
          </h1>
          <button type="button" onClick={() => dialogRef.current?.close()} className="text-white/30 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Nombre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/50">Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name ?? ''}
            onChange={handleChange}
            className="bg-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-white/30 placeholder-white/20"
            placeholder="Nombre del producto"
          />
        </div>

        {/* Precio + Categoría */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 w-28">
            <label className="text-xs font-semibold uppercase tracking-widest text-white/50">Precio</label>
            <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-white/30">
              <span className="text-white/40 text-sm mr-1">$</span>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="bg-transparent text-white text-sm outline-none w-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-semibold uppercase tracking-widest text-white/50">Categoría</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="bg-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-white/30 [&>option]:bg-blue-mirage"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5 justify-end pb-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-white/50">Activo</label>
            <Switch
              key={String(form.is_active)}
              defaultChecked={form.is_active}
              onChange={v => setForm(p => ({ ...p, is_active: v }))}
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/50">Descripción</label>
          <textarea
            name="description"
            value={form.description ?? ''}
            onChange={handleChange}
            rows={2}
            placeholder="Descripción opcional"
            className="bg-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-white/30 placeholder-white/20 resize-none"
          />
        </div>

        {/* Imagen */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/50">Imagen</label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex justify-center items-center h-28 bg-white/5 border border-dashed border-white/20 hover:bg-white/10 hover:border-white/40 rounded-lg overflow-hidden cursor-pointer transition-colors"
          >
            {imagePreview
              ? <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
              : <Upload size={26} className="text-white/20" />
            }
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            title="Seleccionar imagen"
            className="hidden"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Recortar de nuevo
              </button>
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); setForm(p => ({ ...p, img_url: null })); }}
                className="text-xs text-white/30 hover:text-red-400 transition-colors"
              >
                Quitar imagen
              </button>
            </div>
          )}
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        {/* Acciones */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !form.name?.trim()}
            className="bg-white/15 hover:bg-white/25 disabled:opacity-30 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            {loading ? 'Guardando…' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="text-white/50 hover:text-white hover:bg-white/10 text-sm px-5 py-2 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>

      </div>
    </dialog>
    </>
  );
});

ProductForm.displayName = 'ProductForm';
export default ProductForm;
