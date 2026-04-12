import React, { useRef, useState, useEffect } from "react"
import type { Product, ProductInsert } from "../types/types"
import Switch from "./ui/Switch";
import { Plus, X, Upload } from "lucide-react";
import ImagePlaceHolder from "./ui/ImagePlaceHolder";

interface Props {
  producto: Product | null;
}

const emptyProduct: ProductInsert = {
  name: "",
  price: 0,
  isActive: false,
  description: "",
  feature_order: 0,
  img_url: null,
}


export default function ProductForm({ producto }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState<ProductInsert>(emptyProduct);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const [active, setActive] = useState(false);


  useEffect(() => {
    if (producto) {
      const { id, ...rest } = producto;
      setForm(rest);
    } else {
      setForm(emptyProduct);
    }
    setImageFile(null);
    setImagePreview(null);
  }, [producto])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'name' || name === 'description' || name === 'price'
        ? value === '' ? null : value : Number(value),
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  const handleActive = () => {
    const active = form.isActive;
    setForm((prev) => ({
      ...prev,
      isActive: !active,
    }))
  }

  return (
    <div className="min-w-[80%] border mx-4 my-2 rounded-lg bg-amber-smoke flex justify-center">
      <button className="w-full flex justify-center" onClick={() => ref.current?.showModal()}>
        <Plus />
      </button>


      <dialog ref={ref} className="rounded-xl backdrop:bg-amber-smoke/40 w-85 h-130 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2">
        <div className="flex flex-col items-center w-full h-full">
        <div className="flex w-full justify-end">
          {producto ?
            <div className="flex-1 mx-4">
              <h1 className="text-xl font-semibold font-serif">{producto.name}</h1>
            </div>
            : <div className="flex-1 flex justify-center mx-4">
              <h1 className="text-xl font-semibold font-serif">Nuevo</h1>
            </div>
          }
          <button onClick={() => ref.current?.close()}><X /></button>
        </div>
        <div className="w-78 flex flex-col p-4">
          <div className="flex flex-col mb-3">
            <label htmlFor="name" className="mb-2 text-sm">Nombre</label>
            <input
              type="text"
              value={form.name}
              name="name"
              onChange={handleChange}
              className="border-1.5 outline-2 hover:outline-blue-300 border/50 rounded-md outline-blue-mirage/40"
            />
          </div>
          <div className="w-70 flex justify-between items-center">
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-2 text-sm">precio</label>
              <div>
                <span className="mr-2">$</span>
                <input
                  type="number"
                  value={form.price}
                  name="price"
                  onChange={handleChange}
                  className="w-20 outline-2 hover:outline-blue-300 pl-2 border-1.5 border/50 rounded-md outline-blue-mirage/40"
                />
              </div>
            </div>
            <div className="translate-y-2.5">
              <span className="mx-2">Activo: </span>
              <Switch defaultChecked={form.isActive} onChange={() => handleActive()} />
            </div>
          </div>
          <div className="w-full mt-4">
            <label htmlFor="description">Descripcion</label>
            <textarea id="description" name="description" className="border w-70 outline-2 hover:outline-blue-300 rounded-md outline-blue-mirage/40" />
          </div>
        </div>
        <div className="w-full flex flex-col items-center">
          <label>Imagen del producto</label>
          <ImagePlaceHolder className="min-w-60 h-34 my-2 flex justify-center items-center border-2 outline-2 border-blue-mirage hover:outline-blue-300 outline-blue-mirage/40">
            {
              imagePreview || form.img_url ? (
                <img src={imagePreview ?? form.img_url ?? ''} alt="preview" className="h-full object-cover rounded-md" />
              ) : (
                <label>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  <Upload size={34} className="text-blue-mirage/50" />
                </label>
              )
            }
          </ImagePlaceHolder>
        </div>
        <div className="w-full flex justify-end mt-2">
          <button className="border-2 border-to-blue-900 rounded-md px-4 py-1 mx-2 bg-blue-mirage/80 text-blue-100">Guardar</button>
          <button onClick={() => { ref.current?.close() }} className="border-2 border-to-blue-900 rounded-md px-4 py-1 mx-2 bg-blue-mirage/20 text-blue-400/50">Cancelar</button>
        </div>
        </div>
      </dialog>
    </div>
  )
}