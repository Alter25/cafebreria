import { useRef, useState, useEffect } from "react"
import type { Product, ProductInsert } from "../types/types"
import { Divide, Plus } from "lucide-react";
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


  useEffect(() => {
    if (producto) {
      const { id, ...rest } = producto;
      setForm(rest);
    } else {
      setForm(emptyProduct);
    }
    setImageFile(null);
    setImagePreview(null);
  }, [])

  return (
    <div className="min-w-[80%] border mx-4 my-2 rounded-lg bg-amber-smoke flex justify-center">
      <button className="w-full flex justify-center" onClick={() => ref.current?.showModal()}>
        <Plus />
      </button>


      <dialog ref={ref} className="rounded-xl backdrop:bg-amber-smoke/40 w-140 h-130 m-auto px-4 py-2">
        <div className="flex justify-end">
          {producto ?
            <div className="flex-1 mx-4">
              <h1 className="text-xl font-semibold font-serif">{producto.name}</h1>
            </div>
            : <div className="flex-1 mx-4">
              <h1 className="text-xl font-semibold font-serif">Nuevo</h1>
            </div>
          }
          <button onClick={() => ref.current?.close()}><X /></button>
        </div>
        <div className="flex flex-col">
          <div>
            <label htmlFor="name">Nombre:</label>
            <input type="text" />
          </div>
        </div>

      </dialog>
    </div>
  )
}