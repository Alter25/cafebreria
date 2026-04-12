import React, { useRef, useState, useEffect } from "react"
import type { Product, ProductInsert } from "../types/types"
import Switch from "./ui/Switch";
import { Plus } from "lucide-react";
import { X } from "lucide-react";

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


      <dialog ref={ref} className="rounded-xl backdrop:bg-amber-smoke/40 w-100 h-130 m-auto px-4 py-2">
        <div className="flex justify-end">
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
        <div className="flex flex-col p-4">
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
          <div className="w-full flex justify-between items-center">
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
            <textarea id="description" name="description" className="border w-full outline-2 hover:outline-blue-300 rounded-md outline-blue-mirage/40" />
          </div>
        </div>
        <div className="h-30 border rounded-md my-4">
          hola
        </div>
        <div>
          <button className="border-2 border-to-blue-900 rounded-md px-4 py-1 mx-2 bg-blue-mirage/80 text-blue-100">Guardar</button>
          <button className="border-2 border-to-blue-900 rounded-md px-4 py-1 mx-2 bg-blue-mirage/20 text-blue-400/50">Cancelar</button>
        </div>
      </dialog>
    </div>
  )
}