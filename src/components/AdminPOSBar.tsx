import React, { useState } from 'react';
import { ChefHat, Plus, RotateCcw, UserCheck, History, ArrowRight, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { CartItem, OrderRecord } from '../types';
import { formatCurrency } from '../utils/receiptGenerator';
import { ConnectionStatusBadge } from './OfflineBanner';

interface AdminPOSBarProps {
  cashierName: string;
  onUpdateCashierName: (name: string) => void;
  onAddManualItem: (item: CartItem) => void;
  totalOrdersToday: number;
  totalRevenueToday: number;
  recentOrders: OrderRecord[];
  onOpenHistory: () => void;
  onReEnterOrder: (order: OrderRecord) => void;
  onOpenMenuEditor: () => void;
}

export const AdminPOSBar: React.FC<AdminPOSBarProps> = ({
  cashierName,
  onUpdateCashierName,
  onAddManualItem,
  totalOrdersToday,
  totalRevenueToday,
  recentOrders,
  onOpenHistory,
  onReEnterOrder,
  onOpenMenuEditor
}) => {
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [manualQty, setManualQty] = useState(1);

  const handleCreateManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(manualPrice);
    if (!manualTitle.trim() || isNaN(priceNum) || priceNum <= 0) return;

    const manualItem: CartItem = {
      cartItemId: `manual-${Date.now()}`,
      name: manualTitle.trim(),
      category: 'sides',
      unitPrice: priceNum,
      quantity: manualQty || 1,
      specialNote: 'Custom POS Item'
    };

    onAddManualItem(manualItem);
    setManualTitle('');
    setManualPrice('');
    setManualQty(1);
    setShowManualForm(false);
  };

  return (
    <div className="bg-black border-b border-neutral-800 text-white px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Cashier & Mode tag */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 text-black text-xs font-black uppercase tracking-wider shadow-sm">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Admin POS Mode</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-300">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Staff:</span>
            <input
              type="text"
              value={cashierName}
              onChange={(e) => onUpdateCashierName(e.target.value)}
              placeholder="Cashier Name"
              className="bg-neutral-900 border border-neutral-700 px-2.5 py-1 rounded text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-400 w-32"
            />
          </div>
        </div>

        {/* Center/Right: Quick stats, Order History button & Quick Custom Item */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 text-xs bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800 font-mono">
            <span className="text-neutral-400">Today:</span>
            <span className="font-bold text-amber-400">{totalOrdersToday} Bills</span>
            <span className="text-neutral-600">|</span>
            <span className="font-bold text-emerald-400">{formatCurrency(totalRevenueToday)}</span>
          </div>

          {/* Quick Order History & Re-Entry Trigger */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer hover:border-amber-400"
            title="Open previous order history to view or re-enter orders"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Past Orders ({recentOrders.length})</span>
          </button>

          {/* Manage Menu & Prices Modal Trigger */}
          <button
            type="button"
            id="manage-menu-prices-btn"
            onClick={onOpenMenuEditor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer hover:border-amber-400"
            title="Edit menu prices, stock availability, or add items"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Edit Menu & Prices</span>
          </button>

          <button
            type="button"
            onClick={() => setShowManualForm(!showManualForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Open Price Item</span>
          </button>

          <ConnectionStatusBadge className="flex lg:hidden" />
        </div>
      </div>

      {/* Manual Item Entry Drawer/Form */}
      {showManualForm && (
        <form
          onSubmit={handleCreateManualItem}
          className="mt-3 pt-3 border-t border-neutral-800 flex flex-wrap items-center gap-2 animate-fadeIn max-w-6xl mx-auto"
        >
          <span className="text-xs font-bold text-amber-400">Custom Item:</span>
          <input
            type="text"
            placeholder="Description (e.g. Extra Mayo Sachet / Special Salad)"
            value={manualTitle}
            onChange={(e) => setManualTitle(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white flex-1 min-w-[180px] focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <div className="flex items-center gap-1">
            <span className="text-xs text-neutral-400 font-mono">Rs</span>
            <input
              type="number"
              placeholder="Price"
              value={manualPrice}
              onChange={(e) => setManualPrice(e.target.value)}
              className="w-24 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <input
            type="number"
            min="1"
            placeholder="Qty"
            value={manualQty}
            onChange={(e) => setManualQty(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white text-center font-mono"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Punch to Bill
          </button>
          <button
            type="button"
            onClick={() => setShowManualForm(false)}
            className="text-xs text-neutral-400 hover:text-white px-2 py-1"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Fast Quick-Re-entry Strip (Shows latest 3 past orders for fast counter repeat) */}
      {recentOrders.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-neutral-800/80 max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] font-medium shrink-0">
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span className="font-semibold text-neutral-300">Quick Repeat Order:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 flex-1 max-w-2xl">
            {recentOrders.slice(0, 3).map((ord) => (
              <div
                key={ord.id}
                className="bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-xl px-2.5 py-1 flex items-center gap-2 shrink-0 transition-colors"
              >
                <div className="text-[11px]">
                  <span className="font-mono font-bold text-amber-400">#{ord.orderNumber}</span>
                  <span className="text-neutral-300 ml-1.5 font-medium">{ord.customer.name || 'Customer'}</span>
                  <span className="text-neutral-500 font-mono ml-1">({formatCurrency(ord.total)})</span>
                </div>

                <button
                  type="button"
                  onClick={() => onReEnterOrder(ord)}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-xs"
                  title={`Re-enter order #${ord.orderNumber} into current bill`}
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Re-Enter</span>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenHistory}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline shrink-0 flex items-center gap-0.5 cursor-pointer"
          >
            <span>All History</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
