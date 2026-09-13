import React from 'react';
import { ShoppingBag, ChefHat, User, History, Flame, Phone } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../data/menuData';
import { formatCurrency } from '../utils/receiptGenerator';
import { ConnectionStatusBadge } from './OfflineBanner';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  mode: 'customer' | 'admin';
  onToggleMode: (newMode: 'customer' | 'admin') => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenHistory: () => void;
  orderCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onToggleMode,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenHistory,
  orderCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-black text-amber-500 shadow-md border-b border-neutral-800">
      {/* Top hotline banner */}
      <div className="bg-amber-500 text-black px-4 py-1 text-xs font-black flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 fill-black text-black animate-pulse" />
          <span>🔥 EATISTAN • Pir Jo Goth | Fresh Pizzas, Burgers & Loaded Fries</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold">
          <Phone className="w-3 h-3" />
          <span>Hotline: {RESTAURANT_CONFIG.phone}</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center shadow-md font-black text-xl tracking-tighter">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg sm:text-xl text-amber-400 leading-tight tracking-wider">
                {RESTAURANT_CONFIG.name}
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-neutral-900 text-amber-400 border border-amber-500/30">
                POS Billing
              </span>
            </div>
            <p className="text-xs text-neutral-300">
              {RESTAURANT_CONFIG.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offline/Online Status Badge */}
          <ConnectionStatusBadge className="hidden lg:flex" />

          {/* PWA Install Button */}
          <PWAInstallButton className="hidden sm:flex" />

          {/* Mode Switcher: Customer vs Admin */}
          <div className="bg-neutral-900 p-1 rounded-xl border border-neutral-800 flex items-center shadow-inner">
            <button
              id="mode-customer-btn"
              type="button"
              onClick={() => onToggleMode('customer')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'customer'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Customer</span>
            </button>
            <button
              id="mode-admin-btn"
              type="button"
              onClick={() => onToggleMode('admin')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'admin'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Admin POS</span>
            </button>
          </div>

          {/* Orders History & Re-Entry Button */}
          <button
            id="orders-history-btn"
            type="button"
            onClick={onOpenHistory}
            className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="View Previous Orders History & Re-Entry"
          >
            <History className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Past Orders</span>
            {orderCount > 0 && (
              <span className="bg-amber-500 text-black px-1.5 py-0.2 rounded-full text-[10px] font-black">
                {orderCount}
              </span>
            )}
          </button>

          {/* Cart / Bill Button */}
          <button
            id="cart-drawer-trigger-btn"
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-black" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-amber-400 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-amber-500">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Active Bill</span>
            {cartTotal > 0 && (
              <span className="bg-black/80 px-1.5 py-0.5 rounded text-xs font-mono text-amber-300">
                {formatCurrency(cartTotal)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
