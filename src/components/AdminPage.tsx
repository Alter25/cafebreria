import { useState, useEffect } from 'react';
import type { Product } from '../types/types';
import "../styles/global.css";
import DisplayCard from "../components/ui/displayCard";
import ProductForm from "./ProductForm";
import { supabase } from '../lib/supabase';

export default function AdminPage() {
  const [productos, setProductos] = useState<Product[] | null>();

  const onSave = () => {
    fetch();
  }

  const fetch = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) {
      setProductos(data);
    }
  }

  useEffect(() => {
    //fetch
    fetch();
  }, [])

  return <div className="bg-blue-mirage max-w-full flex flex-col items-start h-fit no-scrollbar">
    <h1 className="text-3xl mx-auto my-2">Administrar</h1>
    <div className='w-full pb-80 no-scrollbar'>
      {productos &&
        productos.map(p => (
          <DisplayCard key={p.id} product={p} />
        ))
      }
    </div>
    <ProductForm onSave={onSave} producto={{} as Product} />
  </div>
}