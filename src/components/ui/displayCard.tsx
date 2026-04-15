import type { Product } from "../../types/types";
import SwitchIcon from "./SwitchIcon";
import Switch from "./Switch";
import { useState } from "react";

interface Props {
  product: Product;
}

export default function DisplayCard({ product }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white/5 rounded-xl mx-4 my-1 overflow-hidden">

      {/* Fila principal */}
      <div className="flex items-center gap-3 px-3 py-2">

        {/* Thumbnail */}
        <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-white/10">
          {product.img_url
            ? <img src={product.img_url} alt={product.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full" />
          }
        </div>

        {/* Nombre + categoría */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white truncate capitalize">{product.name}</p>
          <span className="text-xs text-white/40 bg-white/10 rounded px-1.5 py-0.5">
            {product.category}
          </span>
        </div>

        {/* Precio */}
        {!expanded && (
          <span className="text-sm text-white/70 shrink-0">
            ${product.price}
          </span>
        )}

        {/* Activo */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs text-white/40">Activo</span>
          <Switch />
        </div>

        {/* Expandir */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="shrink-0 text-white/30 hover:text-white transition-colors"
        >
          <SwitchIcon size={20} className="border border-white/20 rounded-full p-1" isShowing={expanded} />
        </button>
      </div>

      {/* Detalle expandido */}
      {expanded && (
        <div className="border-t border-white/10 px-3 py-3 flex gap-3">
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <p className="text-xs text-white/40 italic">{product.description ?? '—'}</p>
            <span className="text-sm text-white/70 mt-1">${product.price} Mxn</span>
          </div>
          {product.img_url && (
            <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-white/10">
              <img src={product.img_url} alt={product.name} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
