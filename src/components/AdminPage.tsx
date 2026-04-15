import { useState, useEffect } from 'react';
import type { Category, Product } from '../types/types';
import "../styles/global.css";
import DisplayCard from "../components/ui/displayCard";
import ProductForm from "./ProductForm";
import GalleryAdmin from "./GalleryAdmin";
import LoginForm from "./LoginForm";
import { supabase } from '../lib/supabase';

type Section = 'productos' | 'galeria';

const CATEGORIES: { label: string; value: Category | 'todas' }[] = [
  { label: 'Todas', value: 'todas' },
  { label: 'Bebidas', value: 'bebida' },
  { label: 'Comidas', value: 'comida' },
  { label: 'Lecturas', value: 'lectura' },
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [productos, setProductos] = useState<Product[] | null>();
  const [categoria, setCategoria] = useState<Category | 'todas'>('todas');
  const [section, setSection] = useState<Section>('productos');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(!!data.session);
    });
  }, []);

  const onSave = () => { fetchProducts(); };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setProductos(data);
  };

  useEffect(() => { if (authenticated) fetchProducts(); }, [authenticated]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAuthenticated(false);
  };

  if (authenticated === null) return (
    <div className="min-h-screen bg-blue-mirage flex items-center justify-center">
      <span className="text-white/30 text-sm">Cargando…</span>
    </div>
  );

  if (!authenticated) return <LoginForm onLogin={() => setAuthenticated(true)} />;

  const productosFiltrados = productos?.filter(
    p => categoria === 'todas' || p.category === categoria
  );

  return (
    <div className="flex h-screen bg-blue-mirage overflow-hidden">
      {/* Sidebar */}
      <aside className="w-40 shrink-0 flex flex-col border-r border-white/10 bg-blue-mirage/80">

        {/* Sección */}
        <span className="text-xs font-semibold uppercase tracking-widest text-white/40 px-4 pt-5 pb-2">
          Sección
        </span>
        <nav className="flex flex-col gap-1 px-2">
          {(['productos', 'galeria'] as Section[]).map(s => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors
                ${section === s
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
            >
              {s === 'productos' ? 'Productos' : 'Galería'}
            </button>
          ))}
        </nav>

        {/* Categorías — solo visibles en sección productos */}
        {section === 'productos' && (
          <>
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40 px-4 pt-5 pb-2">
              Categorías
            </span>
            <nav className="flex flex-col gap-1 px-2">
              {CATEGORIES.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setCategoria(value)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors
                    ${categoria === value
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </>
        )}

        {/* Fondo + cerrar sesión */}
        <div className="mt-auto mx-2 mb-4 flex flex-col gap-1">
          <a
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            ← Inicio
          </a>
          <button
            onClick={handleSignOut}
            className="text-left px-3 py-2 rounded-lg text-sm text-white/50 hover:bg-white/10 hover:text-red-400 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <h1 className="text-3xl mx-auto my-2 shrink-0">Administrar</h1>

        {section === 'productos' ? (
          <>
            <div className="flex-1 overflow-y-auto no-scrollbar pb-4 px-2">
              {productosFiltrados?.map(p => (
                <DisplayCard key={p.id} product={p} />
              ))}
            </div>
            <ProductForm onSave={onSave} producto={{} as Product} />
          </>
        ) : (
          <div className="flex-1 overflow-hidden">
            <GalleryAdmin />
          </div>
        )}
      </div>
    </div>
  );
}