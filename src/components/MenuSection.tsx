import { useState, useEffect } from 'react';
import type { Category, Product } from '../types/types';
import { supabase } from '../lib/supabase';
import { BookOpen } from 'lucide-react';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'bebida',  label: 'Bebidas'  },
  { value: 'comida',  label: 'Comida'   },
  { value: 'lectura', label: 'Lecturas' },
];

function MenuCard({ item }: { item: Product }) {
  return (
    <div className="w-72 bg-white border border-parchment rounded-[10px] overflow-hidden flex flex-col
                    hover:shadow-[0_8px_30px_rgba(62,42,20,0.22)] hover:-translate-y-1
                    transition-all duration-200">
      <div className="relative">
        {item.img_url && (
          <div className="w-full h-44 overflow-hidden">
            <img
              src={item.img_url}
              alt={item.name}
              loading="lazy"
              width="288"
              height="176"
              className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500"
            />
          </div>
        )}
        {item.is_recommended && (
          <span className="absolute top-2 left-2 bg-ember text-cream text-[0.68rem] font-ui font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
            ✦ Recomendación
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          <h3 className="font-display text-[1.05rem] font-bold text-bark-dark mb-1 capitalize">
            {item.name}
          </h3>
          {item.description && (
            <p className="font-ui text-[0.85rem] text-ink-soft leading-snug">
              {item.description}
            </p>
          )}
        </div>
        <div className="border-t border-dashed border-parchment pt-3">
          <span className="font-display text-xl font-bold text-ember">
            ${item.price}{' '}
            <span className="text-sm font-ui font-normal text-ink-soft">Mxn</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function BookCard({ item }: { item: Product }) {
  return (
    <div className="w-52 bg-white border border-parchment rounded-[10px] overflow-hidden flex flex-col
                    hover:shadow-[0_8px_30px_rgba(62,42,20,0.22)] hover:-translate-y-1
                    transition-all duration-200">
      {/* Portada */}
      <div className="relative w-full h-72 overflow-hidden bg-parchment/60 flex items-center justify-center">
        {item.img_url
          ? <img
              src={item.img_url}
              alt={item.name}
              loading="lazy"
              width="208"
              height="288"
              className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
            />
          : <BookOpen size={44} className="text-bark/25" />
        }
        {item.is_recommended && (
          <span className="absolute top-2 left-2 bg-ember text-cream text-[0.68rem] font-ui font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
            ✦ Recomendación
          </span>
        )}
      </div>
      {/* Contenido */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ember">
          Recomendamos
        </span>
        <h3 className="font-display text-[0.95rem] font-bold text-bark-dark leading-snug capitalize">
          {item.name}
        </h3>
        {item.description && (
          <p className="font-ui text-[0.8rem] text-ink-soft leading-snug line-clamp-3 flex-1">
            {item.description}
          </p>
        )}
        <div className="mt-auto pt-2 border-t border-dashed border-parchment">
          <span className="font-ui text-[0.75rem] text-ink-soft/60 bg-parchment/80 rounded px-2 py-0.5">
            En librería
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MenuSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [active, setActive]     = useState<Category>('bebida');

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .then(({ data }) => { if (data) setProducts(data); });
  }, []);

  const byCategory = (cat: Category) => products.filter(p => p.category === cat);
  const items = byCategory(active);

  return (
    <>
      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setActive(cat.value)}
            className={[
              'font-ui text-[0.82rem] font-semibold uppercase tracking-[0.06em] px-5 py-2 rounded-full border cursor-pointer transition-all duration-200',
              active === cat.value
                ? 'bg-bark border-bark text-cream'
                : 'bg-transparent border-parchment text-ink-soft hover:border-bark-light hover:text-bark',
            ].join(' ')}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      {items.length === 0 ? (
        <p className="font-ui text-ink-soft/50 text-sm text-center py-8">
          Sin productos en esta categoría.
        </p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 animate-fade-up">
          {items.map(item =>
            item.category === 'lectura'
              ? <BookCard key={item.id} item={item} />
              : <MenuCard key={item.id} item={item} />
          )}
        </div>
      )}
    </>
  );
}
