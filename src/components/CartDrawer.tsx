import React, { useState } from 'react';
import { CartItem, CustomerInfo, DiscountCode, OrderType, PaymentMethod, OrderRecord } from '../types';
import {
  X, Trash2, Plus, Minus, Tag, Check, ArrowRight, RotateCcw,
  ShoppingBag, Bike, UtensilsCrossed, PackageOpen, AlertCircle, Phone, MapPin, User,
  Edit2, Save, Sparkles, DollarSign
} from 'lucide-react';
import { formatCurrency } from '../utils/receiptGenerator';
import { DELIVERY_AREAS, DISCOUNT_CODES } from '../data/menuData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  customerInfo: CustomerInfo;
  onUpdateCustomerInfo: (info: Partial<CustomerInfo>) => void;
  appliedCoupon: string;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  adminDiscount: { type: 'flat' | 'percentage'; value: number };
  onUpdateAdminDiscount: (disc: { type: 'flat' | 'percentage'; value: number }) => void;
  mode: 'customer' | 'admin';
  onGenerateReceipt: () => void;
  reEnteredOrderNotice?: { orderNumber: string; customerName: string } | null;
  onDismissReEnterNotice?: () => void;
  onUpdateCartItem?: (updatedItem: CartItem) => void;
  onAddManualItem?: (item: CartItem) => void;
  editingOrderRecord?: OrderRecord | null;
  onCancelEditingOrder?: () => void;
  onSaveEditedOrder?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  customerInfo,
  onUpdateCustomerInfo,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  adminDiscount,
  onUpdateAdminDiscount,
  mode,
  onGenerateReceipt,
  reEnteredOrderNotice,
  onDismissReEnterNotice,
  onUpdateCartItem,
  onAddManualItem,
  editingOrderRecord,
  onCancelEditingOrder,
  onSaveEditedOrder
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showAdminDiscount, setShowAdminDiscount] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string; area?: string }>({});

  // Line item inline editing states
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemPrice, setEditItemPrice] = useState('');
  const [editItemNote, setEditItemNote] = useState('');

  // Quick custom item in cart states
  const [showCustomItemForm, setShowCustomItemForm] = useState(false);
  const [customItemTitle, setCustomItemTitle] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [customItemQty, setCustomItemQty] = useState(1);

  if (!isOpen) return null;

  // Subtotal
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Delivery Fee calculation
  const selectedAreaObj = DELIVERY_AREAS.find((a) => a.name === customerInfo.deliveryArea);
  let baseDeliveryFee = customerInfo.orderType === 'delivery' ? (selectedAreaObj ? selectedAreaObj.fee : 120) : 0;

  // Discount calculation
  let discountAmount = 0;
  const activeDiscountObj = DISCOUNT_CODES.find((d) => d.code === appliedCoupon);

  if (activeDiscountObj) {
    if (activeDiscountObj.type === 'percentage') {
      discountAmount = (subtotal * activeDiscountObj.value) / 100;
    } else if (activeDiscountObj.type === 'flat') {
      discountAmount = Math.min(subtotal, activeDiscountObj.value);
    } else if (activeDiscountObj.type === 'free_delivery') {
      baseDeliveryFee = 0;
    }
  }

  // Admin discount if applicable
  if (adminDiscount.value > 0) {
    if (adminDiscount.type === 'flat') {
      discountAmount += adminDiscount.value;
    } else {
      discountAmount += (subtotal * adminDiscount.value) / 100;
    }
  }

  discountAmount = Math.min(subtotal, discountAmount);
  const total = Math.max(0, subtotal - discountAmount + baseDeliveryFee);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;

    const success = onApplyCoupon(code);
    if (success) {
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Invalid or expired coupon code / minimum order not met.');
    }
  };

  const handleValidationAndSubmit = () => {
    const errors: { name?: string; phone?: string; area?: string } = {};
    if (!customerInfo.name.trim()) {
      errors.name = 'Please provide customer name';
    }
    if (!customerInfo.phone.trim()) {
      errors.phone = 'Please provide WhatsApp number';
    }
    if (customerInfo.orderType === 'delivery' && !customerInfo.deliveryArea) {
      errors.area = 'Please select delivery area';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    onGenerateReceipt();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg h-full flex flex-col shadow-2xl border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg leading-none">
                Order Bill & Checkout
              </h2>
              <span className="text-xs text-slate-400 mt-0.5 block">
                {items.length} item{items.length !== 1 ? 's' : ''} in cart
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-slate-400 hover:text-red-400 font-semibold px-2 py-1 transition-colors"
                title="Empty cart"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-slate-800">
          {items.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Your cart is empty</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Add delicious Zingers, Pizzas, Broast, or Daily Deals to generate a bill & WhatsApp receipt.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
              >
                Browse Food Menu
              </button>
            </div>
          ) : (
            <>
              {/* Editing Existing Order Banner */}
              {editingOrderRecord && (
                <div className="p-3.5 bg-amber-500/15 border-2 border-amber-500 rounded-2xl flex items-start justify-between gap-3 shadow-xs animate-fadeIn">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Edit2 className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-amber-950 text-sm">
                          Editing Order #{editingOrderRecord.orderNumber}
                        </span>
                        <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                          Edit Mode Active
                        </span>
                      </div>
                      <p className="text-amber-900 text-[11px] mt-0.5 leading-snug">
                        Modifying items, custom prices, customer details, or payment for Order #{editingOrderRecord.orderNumber}.
                      </p>
                    </div>
                  </div>
                  {onCancelEditingOrder && (
                    <button
                      type="button"
                      onClick={onCancelEditingOrder}
                      className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-bold shrink-0 cursor-pointer shadow-xs"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}

              {/* Re-Entered Order Notice Banner */}
              {!editingOrderRecord && reEnteredOrderNotice && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl flex items-start justify-between gap-2.5 shadow-xs animate-fadeIn">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-amber-950">
                          Re-Entering Order #{reEnteredOrderNotice.orderNumber}
                        </span>
                        <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          Fast POS Fill
                        </span>
                      </div>
                      <p className="text-amber-800 text-[11px] mt-0.5 leading-snug">
                        Items, customer ({reEnteredOrderNotice.customerName}) & discounts populated from past record. Punching will assign a fresh bill # with current timestamp.
                      </p>
                    </div>
                  </div>
                  {onDismissReEnterNotice && (
                    <button
                      type="button"
                      onClick={onDismissReEnterNotice}
                      className="text-amber-700 hover:text-amber-900 p-1"
                      title="Dismiss notice"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* 1. Itemized List */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    1. Selected Items ({items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                  <div className="flex items-center gap-2">
                    {onAddManualItem && (
                      <button
                        type="button"
                        onClick={() => setShowCustomItemForm(!showCustomItemForm)}
                        className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Custom Item</span>
                      </button>
                    )}
                    <span className="text-xs text-slate-400 font-mono">
                      Subtotal: {formatCurrency(subtotal)}
                    </span>
                  </div>
                </div>

                {/* Quick In-Cart Custom Item Adder */}
                {showCustomItemForm && onAddManualItem && (
                  <div className="mb-3 p-3 bg-amber-50/80 border border-amber-300 rounded-2xl space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                      <span>+ Punch Custom / Open Price Item</span>
                      <button
                        type="button"
                        onClick={() => setShowCustomItemForm(false)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Item Title (e.g. Extra Cheese Slice)"
                        value={customItemTitle}
                        onChange={(e) => setCustomItemTitle(e.target.value)}
                        className="sm:col-span-2 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-mono text-slate-500">Rs</span>
                        <input
                          type="number"
                          placeholder="Price"
                          value={customItemPrice}
                          onChange={(e) => setCustomItemPrice(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={customItemQty}
                          onChange={(e) => setCustomItemQty(parseInt(e.target.value) || 1)}
                          className="w-14 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-center font-mono font-bold"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const p = parseFloat(customItemPrice);
                          if (!customItemTitle.trim() || isNaN(p) || p <= 0) return;
                          onAddManualItem({
                            cartItemId: `custom-cart-${Date.now()}`,
                            name: customItemTitle.trim(),
                            category: 'sides',
                            unitPrice: p,
                            quantity: customItemQty || 1,
                            specialNote: 'Custom Item'
                          });
                          setCustomItemTitle('');
                          setCustomItemPrice('');
                          setCustomItemQty(1);
                          setShowCustomItemForm(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                      >
                        Add to Bill
                      </button>
                    </div>
                  </div>
                )}

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                  {items.map((item) => {
                    const lineTotal = item.unitPrice * item.quantity;
                    const isEditingThis = editingItemId === item.cartItemId;

                    return (
                      <div key={item.cartItemId} className="p-3 bg-white">
                        {isEditingThis ? (
                          /* Inline Item Editor */
                          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-300 space-y-2.5 animate-fadeIn">
                            <div className="flex items-center justify-between text-xs font-black text-amber-950">
                              <span className="flex items-center gap-1">
                                <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                                <span>Edit Item Details & Custom Price</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setEditingItemId(null)}
                                className="text-slate-400 hover:text-slate-700"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <div className="sm:col-span-2">
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Item Name</label>
                                <input
                                  type="text"
                                  value={editItemName}
                                  onChange={(e) => setEditItemName(e.target.value)}
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Unit Price (Rs.)</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={editItemPrice}
                                  onChange={(e) => setEditItemPrice(e.target.value)}
                                  className="w-full bg-white border border-amber-400 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono font-bold"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Special Instructions / Notes</label>
                              <input
                                type="text"
                                placeholder="e.g. without onions, extra crisp, pack separately"
                                value={editItemNote}
                                onChange={(e) => setEditItemNote(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800"
                              />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingItemId(null)}
                                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 font-medium"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const p = parseFloat(editItemPrice);
                                  if (isNaN(p) || p <= 0 || !editItemName.trim()) {
                                    alert('Please provide valid name and price');
                                    return;
                                  }
                                  if (onUpdateCartItem) {
                                    onUpdateCartItem({
                                      ...item,
                                      name: editItemName.trim(),
                                      unitPrice: p,
                                      specialNote: editItemNote.trim()
                                    });
                                  }
                                  setEditingItemId(null);
                                }}
                                className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-lg shadow-xs cursor-pointer"
                              >
                                <Save className="w-3 h-3" />
                                <span>Save Changes</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Standard Item Row */
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-black text-slate-900">{item.name}</span>
                                {item.selectedSize && (
                                  <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                                    {item.selectedSize}
                                  </span>
                                )}
                                {item.dealTag && (
                                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                                    {item.dealTag}
                                  </span>
                                )}
                              </div>

                              {item.selectedSpice && (
                                <p className="text-[11px] text-red-600 font-medium mt-0.5">
                                  🌶️ {item.selectedSpice}
                                </p>
                              )}

                              {item.selectedAddons && item.selectedAddons.length > 0 && (
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  +{item.selectedAddons.map((a) => a.name).join(', ')}
                                </p>
                              )}

                              {item.specialNote && (
                                <p className="text-[11px] text-amber-700 italic mt-0.5 font-medium">
                                  "{item.specialNote}"
                                </p>
                              )}

                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-mono font-bold text-slate-800">
                                  {formatCurrency(item.unitPrice)} each
                                </span>

                                {/* Inline Edit Item Trigger */}
                                {onUpdateCartItem && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingItemId(item.cartItemId);
                                      setEditItemName(item.name);
                                      setEditItemPrice(item.unitPrice.toString());
                                      setEditItemNote(item.specialNote || '');
                                    }}
                                    className="text-[10px] text-amber-600 hover:text-amber-800 font-bold flex items-center gap-0.5 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                                    title="Edit price, name or instructions for this item"
                                  >
                                    <Edit2 className="w-2.5 h-2.5" />
                                    <span>Edit</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Quantity Controls & Delete */}
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <div className="text-xs font-black font-mono text-slate-900">
                                {formatCurrency(lineTotal)}
                              </div>

                              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                                  className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-5 text-center text-xs font-bold font-mono">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                                  className="w-6 h-6 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center font-bold"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onRemoveItem(item.cartItemId)}
                                  className="w-6 h-6 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 flex items-center justify-center ml-0.5"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Apply Daily Deal / Discount Code */}
              <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-amber-700" />
                    2. Apply Daily Deal / Discount Code
                  </span>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={onRemoveCoupon}
                      className="text-[11px] text-red-600 hover:underline font-bold"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-300">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-black font-mono text-emerald-800">
                          {appliedCoupon} APPLIED
                        </span>
                        <p className="text-[10px] text-slate-500">
                          {activeDiscountObj?.description || 'Promo discount applied'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-black text-emerald-700">
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter Promo Code (e.g. AZADI)"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError('');
                        }}
                        className="flex-1 uppercase font-mono px-3 py-2 text-xs rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {couponError}
                      </p>
                    )}

                    {/* Quick codes chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      <span className="text-[10px] font-bold text-amber-900/70">Suggested:</span>
                      {DISCOUNT_CODES.map((dc) => (
                        <button
                          key={dc.code}
                          type="button"
                          onClick={() => handleApplyCoupon(dc.code)}
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 cursor-pointer"
                        >
                          {dc.code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Custom Discount Toggle */}
                {mode === 'admin' && (
                  <div className="mt-3 pt-2.5 border-t border-amber-200/60">
                    <button
                      type="button"
                      onClick={() => setShowAdminDiscount(!showAdminDiscount)}
                      className="text-[11px] text-slate-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>⚡ Cashier Manual Discount (Admin Override)</span>
                      <span>{showAdminDiscount ? '▲' : '▼'}</span>
                    </button>

                    {showAdminDiscount && (
                      <div className="mt-2 p-2.5 bg-white rounded-xl border border-slate-300 flex items-center gap-2">
                        <select
                          value={adminDiscount.type}
                          onChange={(e) =>
                            onUpdateAdminDiscount({
                              ...adminDiscount,
                              type: e.target.value as 'flat' | 'percentage'
                            })
                          }
                          className="text-xs p-1.5 border rounded-lg bg-slate-50"
                        >
                          <option value="flat">Flat PKR (Rs.)</option>
                          <option value="percentage">Percentage (%)</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Amount"
                          value={adminDiscount.value || ''}
                          onChange={(e) =>
                            onUpdateAdminDiscount({
                              ...adminDiscount,
                              value: parseFloat(e.target.value) || 0
                            })
                          }
                          className="w-24 text-xs p-1.5 border rounded-lg"
                        />
                        <span className="text-xs text-slate-500 font-semibold">off total</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Customer Info & Delivery Area */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    3. Customer & Delivery Info
                  </span>
                  <span className="text-[11px] text-red-500 font-bold">* Required for Receipt</span>
                </div>

                {/* Order Type Toggle */}
                <div className="grid grid-cols-3 gap-1.5 bg-slate-200 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => onUpdateCustomerInfo({ orderType: 'delivery' })}
                    className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      customerInfo.orderType === 'delivery'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5" />
                    <span>Delivery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateCustomerInfo({ orderType: 'takeaway' })}
                    className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      customerInfo.orderType === 'takeaway'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <PackageOpen className="w-3.5 h-3.5" />
                    <span>Takeaway</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateCustomerInfo({ orderType: 'dinein' })}
                    className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      customerInfo.orderType === 'dinein'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Dine-In</span>
                  </button>
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-customer-name"
                    placeholder="e.g. Ahmad Khan"
                    value={customerInfo.name}
                    onChange={(e) => onUpdateCustomerInfo({ name: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      formErrors.name ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-[10px] text-red-500 font-semibold mt-0.5">{formErrors.name}</p>
                  )}
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2.5 py-2 text-xs font-mono font-bold text-slate-600 bg-slate-200 rounded-l-xl border border-r-0 border-slate-300">
                      🇵🇰 +92
                    </span>
                    <input
                      type="tel"
                      id="input-customer-phone"
                      placeholder="300 1234567"
                      value={customerInfo.phone}
                      onChange={(e) => onUpdateCustomerInfo({ phone: e.target.value })}
                      className={`flex-1 px-3 py-2 text-xs font-mono rounded-r-xl border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        formErrors.phone ? 'border-red-500 bg-red-50' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-[10px] text-red-500 font-semibold mt-0.5">{formErrors.phone}</p>
                  )}
                </div>

                {/* Delivery Area & Address (If Delivery) */}
                {customerInfo.orderType === 'delivery' && (
                  <div className="space-y-2.5 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        Delivery Area / Zone <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="select-delivery-area"
                        value={customerInfo.deliveryArea}
                        onChange={(e) => onUpdateCustomerInfo({ deliveryArea: e.target.value })}
                        className={`w-full px-3 py-2 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                          formErrors.area ? 'border-red-500' : 'border-slate-300'
                        }`}
                      >
                        <option value="">-- Choose Area --</option>
                        {DELIVERY_AREAS.map((area) => (
                          <option key={area.name} value={area.name}>
                            {area.name} (+{formatCurrency(area.fee)}) • {area.eta}
                          </option>
                        ))}
                      </select>
                      {formErrors.area && (
                        <p className="text-[10px] text-red-500 font-semibold mt-0.5">{formErrors.area}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Street Address / House No. / Landmark
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. House #14, Street 5, Block 13-D"
                        value={customerInfo.customAddress}
                        onChange={(e) => onUpdateCustomerInfo({ customAddress: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                )}

                {/* Table Number (If Dine-In) */}
                {customerInfo.orderType === 'dinein' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Table Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Table #04"
                      value={customerInfo.tableNumber}
                      onChange={(e) => onUpdateCustomerInfo({ tableNumber: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                )}

                {/* Payment Method */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={customerInfo.paymentMethod}
                    onChange={(e) =>
                      onUpdateCustomerInfo({ paymentMethod: e.target.value as PaymentMethod })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="cod">Cash on Delivery (COD) / Counter Cash</option>
                    <option value="easypaisa">Easypaisa</option>
                    <option value="jazzcash">JazzCash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="card">Credit / Debit Card</option>
                  </select>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Order Note / Kitchen Memo
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bring change of 5000, ring bell twice"
                    value={customerInfo.notes}
                    onChange={(e) => onUpdateCustomerInfo({ notes: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              {/* 4. Bill Financial Breakdown */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400 font-bold">
                    <span>Discount Applied:</span>
                    <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                {customerInfo.orderType === 'delivery' && (
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Delivery Charges:</span>
                    <span className="font-mono">
                      {baseDeliveryFee === 0 ? (
                        <span className="text-emerald-400 font-bold">FREE</span>
                      ) : (
                        formatCurrency(baseDeliveryFee)
                      )}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-black uppercase text-amber-400">Total Payable:</span>
                  <span className="text-2xl font-black font-mono text-white">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Sticky Footer with Primary Action */}
        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-200 shadow-lg space-y-2">
            {editingOrderRecord ? (
              <div className="space-y-2">
                <button
                  type="button"
                  id="save-edited-order-btn"
                  onClick={() => {
                    const errors: { name?: string; phone?: string; area?: string } = {};
                    if (!customerInfo.name.trim()) errors.name = 'Please provide customer name';
                    if (!customerInfo.phone.trim()) errors.phone = 'Please provide WhatsApp number';
                    if (customerInfo.orderType === 'delivery' && !customerInfo.deliveryArea) {
                      errors.area = 'Please select delivery area';
                    }
                    if (Object.keys(errors).length > 0) {
                      setFormErrors(errors);
                      return;
                    }
                    setFormErrors({});
                    if (onSaveEditedOrder) {
                      onSaveEditedOrder();
                    }
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-between shadow-lg active:scale-98 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    <span>Save Updates to Order #{editingOrderRecord.orderNumber}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-sm bg-black text-white px-2.5 py-1 rounded-xl">
                    <span>{formatCurrency(total)}</span>
                    <Check className="w-4 h-4 text-amber-400" />
                  </div>
                </button>
                {onCancelEditingOrder && (
                  <button
                    type="button"
                    onClick={onCancelEditingOrder}
                    className="w-full py-2 px-3 text-xs text-slate-600 hover:text-slate-900 font-bold text-center cursor-pointer"
                  >
                    Cancel Editing & Discard Changes
                  </button>
                )}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  id="generate-bill-whatsapp-btn"
                  onClick={handleValidationAndSubmit}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-between shadow-lg active:scale-98 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧾</span>
                    <span>Generate Bill & WhatsApp Receipt</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-sm bg-emerald-700/80 px-2.5 py-1 rounded-xl">
                    <span>{formatCurrency(total)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-1.5 font-medium">
                  Instant 1-click WhatsApp text generation & printable POS bill
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
