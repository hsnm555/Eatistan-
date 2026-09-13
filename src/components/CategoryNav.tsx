import React from 'react';
import { CategoryType } from '../types';

interface CategoryNavProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  dealsCount: number;
}

interface CategoryOption {
  id: CategoryType;
  label: string;
  sublabel?: string;
  icon: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'deals', label: 'Deals & Combos', sublabel: 'Special Savings', icon: '🌟' },
  { id: 'classic_pizza', label: 'Classic Pizzas', sublabel: 'Fajita, Tikka & Veg', icon: '🍕' },
  { id: 'specialty_pizza', label: 'Specialty Pizzas', sublabel: 'Lava, Calzone & Crown', icon: '🧀' },
  { id: 'burgers', label: 'Burgers', sublabel: 'Zinger, Monster & Veg', icon: '🍔' },
  { id: 'fried_chicken', label: 'Fried Chicken', sublabel: 'Wings, Breast & Shots', icon: '🍗' },
  { id: 'wraps', label: 'Wraps & Parathas', sublabel: 'Zinger & Tikka Rolls', icon: '🌯' },
  { id: 'pasta', label: 'Pasta & Noodles', sublabel: 'Alfredo & Lasagna', icon: '🍝' },
  { id: 'sides', label: 'Fries & Sides', sublabel: 'Loaded & Mayo Fries', icon: '🍟' },
  { id: 'drinks', label: 'Beverages', sublabel: 'Next Cola & Pakola', icon: '🥤' },
  { id: 'all', label: 'All Items', icon: '📋' }
];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  dealsCount
}) => {
  return (
    <div className="bg-white border-b border-slate-200 shadow-sm sticky top-[73px] sm:top-[77px] z-20">
      <div className="max-w-6xl mx-auto px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-0.5">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <div className="text-left leading-tight">
                  <div className="font-bold flex items-center gap-1">
                    {cat.label}
                    {cat.id === 'deals' && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isActive ? 'bg-amber-400 text-slate-950' : 'bg-red-500 text-white animate-pulse'
                      }`}>
                        {dealsCount}
                      </span>
                    )}
                  </div>
                  {cat.sublabel && (
                    <div className={`text-[10px] hidden sm:block ${
                      isActive ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {cat.sublabel}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
