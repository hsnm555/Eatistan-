import React from 'react';
import { MenuItem } from '../types';
import { Plus, Minus, Flame, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { formatCurrency } from '../utils/receiptGenerator';

interface MenuCardProps {
  item: MenuItem;
  quantityInCart: number;
  onQuickAdd: (item: MenuItem) => void;
  onRemoveOne: (item: MenuItem) => void;
  onOpenCustomize: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  quantityInCart,
  onQuickAdd,
  onRemoveOne,
  onOpenCustomize
}) => {
  const hasOptions = (item.sizes && item.sizes.length > 0) || (item.spiceLevels && item.spiceLevels.length > 0) || (item.addons && item.addons.length > 0);

  return (
    <div
      id={`menu-item-${item.id}`}
      className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-3.5 sm:p-4 shadow-sm hover:shadow transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Thumbnail & Badges */}
        <div className="relative mb-3 rounded-xl overflow-hidden aspect-[4/3] bg-slate-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {item.isPopular && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500 text-slate-950 flex items-center gap-1 shadow-sm">
                <Sparkles className="w-2.5 h-2.5" />
                POPULAR
              </span>
            )}
            {item.isSpicy && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-red-600 text-white flex items-center gap-1 shadow-sm">
                <Flame className="w-2.5 h-2.5" />
                SPICY
              </span>
            )}
          </div>
          {hasOptions && (
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white">
              Options
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-amber-600 transition-colors">
          {item.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Portion / Spice info tags */}
        {item.sizes && item.sizes.length > 0 && (
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            <span className="text-[10px] text-slate-400 font-semibold">Sizes:</span>
            {item.sizes.map((s, idx) => (
              <span key={idx} className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-medium">
                {s.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price & Action Row */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Starting from</span>
          <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
            {formatCurrency(item.basePrice)}
          </span>
        </div>

        {hasOptions ? (
          <button
            type="button"
            id={`btn-customize-${item.id}`}
            onClick={() => onOpenCustomize(item)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              quantityInCart > 0
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{quantityInCart > 0 ? `In Cart (${quantityInCart})` : 'Select & Add'}</span>
          </button>
        ) : quantityInCart > 0 ? (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => onRemoveOne(item)}
              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors shadow-xs"
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-xs font-black text-slate-900 font-mono">
              {quantityInCart}
            </span>
            <button
              type="button"
              onClick={() => onQuickAdd(item)}
              className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center transition-colors shadow-xs"
              title="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            id={`btn-quick-add-${item.id}`}
            onClick={() => onQuickAdd(item)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
};
