import { useState, useEffect } from 'react';
import type { Category, Product } from '../types/types';
import { supabase } from '../lib/supabase';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'bebida', label: 'Bebidas' },
  { value: 'comida', label: 'Comida'  },
  { value: 'lectura', label: 'Lectura' },
];

export default function MenuSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [active, setActive] = useState<Category>('bebida');

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .then(({ data }) => { if (data) setProducts(data); });
  }, []);

  const byCategory = (cat: Category) => products.filter(p => p.category === cat);

  return (
    <>
      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
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

      {/* Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-fade-up">
        {byCategory(active).length === 0 && (
          <p className="font-ui text-ink-soft/50 text-sm col-span-full text-center py-8">
            Sin productos en esta categoría.
          </p>
        )}
        {byCategory(active).map(item => (
          <div
            key={item.id}
            className="bg-white border border-parchment rounded-[10px] overflow-hidden flex flex-col
                       hover:shadow-[0_8px_30px_rgba(62,42,20,0.22)] hover:-translate-y-1
                       transition-all duration-200"
          >
            {item.img_url && (
              <div className="w-full h-44 overflow-hidden">
                <img
                  src={item.img_url}
                  alt={item.name}
                  loading="lazy"
                  width="800"
                  height="176"
                  className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-500"
                />
              </div>
            )}
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
        ))}
      </div>
    </>
  );
}
