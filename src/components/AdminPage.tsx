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
    if (!error && data) {
      setProductos(data);
    }
  }

  useEffect(() => {
    //fetch
    fetch();
  }, [])

  return <div className="bg-blue-mirage max-w-full h-screen flex flex-col items-start">
    <h1 className="text-3xl mx-auto my-2">Administrar</h1>
    <DisplayCard />
    <ProductForm onSave={onSave} producto={{} as Product} />
  </div>
}