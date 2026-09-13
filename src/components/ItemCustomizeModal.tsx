import React, { useState, useEffect } from 'react';
import { MenuItem, MenuItemAddon, CartItem } from '../types';
import { X, Plus, Minus, Check, Flame, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/receiptGenerator';

interface ItemCustomizeModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    item?.sizes && item.sizes.length > 0 ? item.sizes[0].name : ''
  );
  const [selectedSpice, setSelectedSpice] = useState<string>(
    item?.spiceLevels && item.spiceLevels.length > 0 ? item.spiceLevels[0] : ''
  );
  const [selectedAddons, setSelectedAddons] = useState<MenuItemAddon[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialNote, setSpecialNote] = useState<string>('');

  useEffect(() => {
    if (item) {
      setSelectedSize(item.sizes && item.sizes.length > 0 ? item.sizes[0].name : '');
      setSelectedSpice(item.spiceLevels && item.spiceLevels.length > 0 ? item.spiceLevels[0] : '');
      setSelectedAddons([]);
      setQuantity(1);
      setSpecialNote('');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  // Calculate unit price based on size and addons
  const sizeObj = item.sizes?.find((s) => s.name === selectedSize);
  const sizeModifier = sizeObj ? sizeObj.priceModifier : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = item.basePrice + sizeModifier + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddon = (addon: MenuItemAddon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleAdd = () => {
    const newCartItem: CartItem = {
      cartItemId: `${item.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      menuItemId: item.id,
      name: item.name,
      category: item.category,
      unitPrice,
      quantity,
      selectedSize: selectedSize || undefined,
      selectedSpice: selectedSpice || undefined,
      selectedAddons: selectedAddons.length > 0 ? selectedAddons : undefined,
      specialNote: specialNote.trim() || undefined
    };

    onAddToCart(newCartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="relative h-44 sm:h-52 w-full bg-slate-900">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-slate-900/80 px-2 py-0.5 rounded">
              {item.category.toUpperCase()}
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1 leading-tight">
              {item.name}
            </h2>
            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
              {item.description}
            </p>
          </div>
        </div>

        {/* Modal Body - Scrollable Options */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-800">
          {/* Sizes / Portions */}
          {item.sizes && item.sizes.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Select Size / Portion <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {item.sizes.map((s) => {
                  const isSelected = selectedSize === s.name;
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setSelectedSize(s.name)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900">{s.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                        {s.priceModifier > 0 ? `+${formatCurrency(s.priceModifier)}` : 'Standard'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spice Level */}
          {item.spiceLevels && item.spiceLevels.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                2. Choose Spice Level
              </label>
              <div className="flex flex-wrap gap-2">
                {item.spiceLevels.map((lvl) => {
                  const isSelected = selectedSpice === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedSpice(lvl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {item.addons && item.addons.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                3. Add-Ons & Extras (Optional)
              </label>
              <div className="space-y-2">
                {item.addons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-emerald-50/70 border-emerald-400'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs font-bold text-slate-800">{addon.name}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-700">
                        +{formatCurrency(addon.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Special Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Extra crispy, no onions, sauce on the side..."
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-300 shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-black font-mono text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            id="modal-add-to-cart-btn"
            onClick={handleAdd}
            className="flex-1 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-between shadow-md active:scale-98 transition-all cursor-pointer"
          >
            <span>Add to Order</span>
            <span className="font-mono bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-black">
              {formatCurrency(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
