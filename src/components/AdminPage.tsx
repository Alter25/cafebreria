import { useState, useEffect, useRef } from 'react';
import type { Category, Product } from '../types/types';
import "../styles/global.css";
import DisplayCard from "../components/ui/displayCard";
import ProductForm from "./ProductForm";
import GalleryAdmin from "./GalleryAdmin";
import LoginForm from "./LoginForm";
import { supabase } from '../lib/supabase';

type Section = 'productos' | 'galeria';

const CATEGORIES: { label: string; value: Category | 'todas' }[] = [
  { label: 'Todas',    value: 'todas'   },
  { label: 'Bebidas',  value: 'bebida'  },
  { label: 'Comidas',  value: 'comida'  },
  { label: 'Lecturas', value: 'lectura' },
];

function Dropdown({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onToggle]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
      >
        {label}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 min-w-36 bg-blue-mirage border border-white/10 rounded-xl shadow-xl py-1 z-50">
          {children}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [productos, setProductos] = useState<Product[] | null>();
  const [categoria, setCategoria] = useState<Category | 'todas'>('todas');
  const [section, setSection] = useState<Section>('productos');
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(!!data.session);
    });
  }, []);

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

  const catLabel = CATEGORIES.find(c => c.value === categoria)?.label ?? 'Todas';

  return (
    <div className="flex flex-col h-screen bg-blue-mirage overflow-hidden">

      {/* Navbar */}
      <header className="shrink-0 flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-blue-mirage/90 backdrop-blur-sm">

        {/* Brand */}
        <span className="text-sm font-semibold text-white/80 mr-2 hidden sm:block">
          Admin
        </span>
        <div className="w-px h-4 bg-white/15 hidden sm:block" />

        {/* Sección: Productos con dropdown de categoría */}
        <Dropdown
          label={section === 'productos' ? `Productos · ${catLabel}` : 'Productos'}
          open={dropOpen && section === 'productos'}
          onToggle={() => {
            setSection('productos');
            setDropOpen(o => section !== 'productos' ? true : !o);
          }}
        >
          {CATEGORIES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => { setCategoria(value); setDropOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors
                ${categoria === value && section === 'productos'
                  ? 'text-white font-semibold bg-white/10'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
            >
              {label}
            </button>
          ))}
        </Dropdown>

        {/* Galería */}
        <button
          onClick={() => { setSection('galeria'); setDropOpen(false); }}
          className={`px-3 py-2 rounded-lg text-sm transition-colors
            ${section === 'galeria'
              ? 'bg-white/15 text-white font-semibold'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
        >
          Galería
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Acciones */}
        <a
          href="/"
          className="px-3 py-2 rounded-lg text-sm text-white/50 hover:bg-white/10 hover:text-white transition-colors hidden sm:block"
        >
          ← Inicio
        </a>
        <button
          onClick={handleSignOut}
          className="px-3 py-2 rounded-lg text-sm text-white/50 hover:bg-white/10 hover:text-red-400 transition-colors"
        >
          Salir
        </button>
      </header>

      {/* Contenido */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {section === 'productos' ? (
          <>
            <div className="flex-1 overflow-y-auto no-scrollbar py-3 px-4">
              <div className="max-w-3xl mx-auto flex flex-col gap-2">
                {productosFiltrados?.map(p => (
                  <DisplayCard key={p.id} product={p} />
                ))}
              </div>
            </div>
            <ProductForm onSave={fetchProducts} producto={{} as Product} />
          </>
        ) : (
          <div className="flex-1 overflow-hidden max-w-3xl mx-auto w-full">
            <GalleryAdmin />
          </div>
        )}
      </main>

    </div>
  );
}
