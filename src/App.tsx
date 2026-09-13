/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  CategoryType,
  MenuItem,
  DailyDeal,
  CartItem,
  CustomerInfo,
  OrderRecord,
  OrderStatus
} from './types';
import {
  MENU_ITEMS,
  DAILY_DEALS,
  DISCOUNT_CODES,
  DELIVERY_AREAS,
  RESTAURANT_CONFIG,
  INITIAL_SAMPLE_ORDERS
} from './data/menuData';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { DailyDealsSection } from './components/DailyDealsSection';
import { MenuCard } from './components/MenuCard';
import { ItemCustomizeModal } from './components/ItemCustomizeModal';
import { CartDrawer } from './components/CartDrawer';
import { ReceiptModal } from './components/ReceiptModal';
import { AdminPOSBar } from './components/AdminPOSBar';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { MenuEditorModal } from './components/MenuEditorModal';
import { OfflineBanner } from './components/OfflineBanner';
import { Search, ShoppingBag, Sparkles, Check, ArrowRight, Phone, MapPin, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { formatCurrency } from './utils/receiptGenerator';

const STORAGE_KEY_ORDERS = 'eatistan_orders_history_v2';
const STORAGE_KEY_MODE = 'eatistan_app_mode';
const STORAGE_KEY_CASHIER = 'eatistan_cashier_name';
const STORAGE_KEY_MENU = 'eatistan_menu_catalog_v2';
const STORAGE_KEY_CART_DRAFT = 'eatistan_active_cart_draft';

export default function App() {
  // App Mode: Customer Order vs Admin Entry
  const [mode, setMode] = useState<'customer' | 'admin'>(() => {
    return (localStorage.getItem(STORAGE_KEY_MODE) as 'customer' | 'admin') || 'admin';
  });

  const [cashierName, setCashierName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_CASHIER) || 'Counter Staff';
  });

  // Editable Menu Catalog State (loaded from localStorage or defaults)
  const [menuCatalog, setMenuCatalog] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MENU);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return MENU_ITEMS;
  });

  // Navigation & Filter
  const [activeCategory, setActiveCategory] = useState<CategoryType>('deals');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Customer Info State (Restores draft from localStorage if available)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const draft = localStorage.getItem(STORAGE_KEY_CART_DRAFT);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (Array.isArray(parsed?.cartItems)) return parsed.cartItems;
      }
    } catch {}
    return [];
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
    try {
      const draft = localStorage.getItem(STORAGE_KEY_CART_DRAFT);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed?.customerInfo) return parsed.customerInfo;
      }
    } catch {}
    return {
      name: '',
      phone: '',
      orderType: 'delivery',
      deliveryArea: 'Pir Jo Goth Central (City)',
      customAddress: '',
      tableNumber: '',
      paymentMethod: 'cod',
      notes: ''
    };
  });

  // Discounts
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [adminDiscount, setAdminDiscount] = useState<{ type: 'flat' | 'percentage'; value: number }>({
    type: 'flat',
    value: 0
  });

  // Re-entry tracking state
  const [reEnteredNotice, setReEnteredNotice] = useState<{ orderNumber: string; customerName: string } | null>(null);

  // Active Order Edit state (for modifying existing past orders)
  const [editingOrder, setEditingOrder] = useState<OrderRecord | null>(null);

  // Modals
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<OrderRecord | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isMenuEditorOpen, setIsMenuEditorOpen] = useState<boolean>(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Orders History (Initialized with realistic sample orders if storage empty)
  const [ordersHistory, setOrdersHistory] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_SAMPLE_ORDERS;
    } catch {
      return INITIAL_SAMPLE_ORDERS;
    }
  });

  // Persist mode, orders & menu catalog
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MODE, mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CASHIER, cashierName);
  }, [cashierName]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(ordersHistory));
  }, [ordersHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(menuCatalog));
  }, [menuCatalog]);

  // Persist active cart draft so cashier never loses pending bill on refresh/reconnect
  useEffect(() => {
    try {
      if (cartItems.length > 0) {
        localStorage.setItem(STORAGE_KEY_CART_DRAFT, JSON.stringify({ cartItems, customerInfo }));
      } else {
        localStorage.removeItem(STORAGE_KEY_CART_DRAFT);
      }
    } catch {}
  }, [cartItems, customerInfo]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [cartItems]);

  const cartTotalItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Today stats for admin
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = ordersHistory.filter(
      (o) => new Date(o.timestamp).toDateString() === today
    );
    const revenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    return { count: todayOrders.length, revenue };
  }, [ordersHistory]);

  // Filtered Menu Items (using dynamic editable menu catalog)
  const filteredMenuItems = useMemo(() => {
    return menuCatalog.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' ? true : item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuCatalog, activeCategory, searchQuery]);

  // Menu Catalog Editing Handlers
  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuCatalog((prev) =>
      prev.map((i) => (i.id === updatedItem.id ? updatedItem : i))
    );
    showToast(`Updated "${updatedItem.name}" in menu`);
  };

  const handleAddMenuItem = (newItem: MenuItem) => {
    setMenuCatalog((prev) => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to menu catalog`);
  };

  const handleDeleteMenuItem = (itemId: string) => {
    setMenuCatalog((prev) => prev.filter((i) => i.id !== itemId));
    showToast('Item deleted from menu');
  };

  const handleResetMenuToDefault = () => {
    setMenuCatalog(MENU_ITEMS);
    localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(MENU_ITEMS));
    showToast('Menu catalog restored to default');
  };

  // Line item inline editing inside cart
  const handleUpdateCartItem = (updatedItem: CartItem) => {
    setCartItems((prev) =>
      prev.map((ci) => (ci.cartItemId === updatedItem.cartItemId ? updatedItem : ci))
    );
    showToast(`Updated ${updatedItem.name}`);
  };

  // EDIT EXISTING PAST ORDER HANDLERS:
  const handleStartEditingOrder = (order: OrderRecord) => {
    setEditingOrder(order);
    setCartItems([...order.items]);
    setCustomerInfo({ ...order.customer });
    setAppliedCoupon(order.appliedCoupon || '');
    setAdminDiscount(order.adminDiscount || { type: 'flat', value: 0 });
    setReEnteredNotice(null);
    setIsCartOpen(true);
    showToast(`✏️ Loaded Order #${order.orderNumber} for editing`);
  };

  const handleCancelEditingOrder = () => {
    setEditingOrder(null);
    setCartItems([]);
    setReEnteredNotice(null);
    showToast('Cancelled editing order');
  };

  const handleSaveEditedOrder = () => {
    if (!editingOrder) return;

    // Delivery Fee
    const selectedAreaObj = DELIVERY_AREAS.find((a) => a.name === customerInfo.deliveryArea);
    let baseDeliveryFee = customerInfo.orderType === 'delivery' ? (selectedAreaObj ? selectedAreaObj.fee : 50) : 0;

    // Discount calculation
    let discountAmount = 0;
    const activeDiscountObj = DISCOUNT_CODES.find((d) => d.code === appliedCoupon);
    if (activeDiscountObj) {
      if (activeDiscountObj.type === 'percentage') {
        discountAmount = (cartSubtotal * activeDiscountObj.value) / 100;
      } else if (activeDiscountObj.type === 'flat') {
        discountAmount = Math.min(cartSubtotal, activeDiscountObj.value);
      } else if (activeDiscountObj.type === 'free_delivery') {
        baseDeliveryFee = 0;
      }
    }

    if (adminDiscount.value > 0) {
      if (adminDiscount.type === 'flat') {
        discountAmount += adminDiscount.value;
      } else {
        discountAmount += (cartSubtotal * adminDiscount.value) / 100;
      }
    }

    discountAmount = Math.min(cartSubtotal, discountAmount);
    const total = Math.max(0, cartSubtotal - discountAmount + baseDeliveryFee);

    const updatedRecord: OrderRecord = {
      ...editingOrder,
      customer: { ...customerInfo },
      items: [...cartItems],
      subtotal: cartSubtotal,
      discount: discountAmount,
      deliveryFee: baseDeliveryFee,
      total,
      appliedCoupon: appliedCoupon || undefined,
      adminDiscount: adminDiscount.value > 0 ? adminDiscount : undefined,
      cashierName: mode === 'admin' ? cashierName : editingOrder.cashierName,
      timestamp: Date.now()
    };

    setOrdersHistory((prev) =>
      prev.map((o) => (o.id === editingOrder.id ? updatedRecord : o))
    );

    setActiveReceiptOrder(updatedRecord);
    setIsCartOpen(false);
    setEditingOrder(null);
    setCartItems([]);
    setIsReceiptOpen(true);
    showToast(`✅ Saved updates to Order #${updatedRecord.orderNumber}!`);
  };

  // Cart Handlers
  const handleQuickAdd = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.menuItemId === item.id && !ci.selectedSize && !ci.selectedAddons?.length);
      if (existing) {
        return prev.map((ci) =>
          ci.cartItemId === existing.cartItemId ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      const newItem: CartItem = {
        cartItemId: `${item.id}-${Date.now()}`,
        menuItemId: item.id,
        name: item.name,
        category: item.category,
        unitPrice: item.basePrice,
        quantity: 1
      };
      return [...prev, newItem];
    });
    showToast(`Added ${item.name} to bill`);
  };

  const handleRemoveOne = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.menuItemId === item.id && !ci.selectedSize && !ci.selectedAddons?.length);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter((ci) => ci.cartItemId !== existing.cartItemId);
      }
      return prev.map((ci) =>
        ci.cartItemId === existing.cartItemId ? { ...ci, quantity: ci.quantity - 1 } : ci
      );
    });
  };

  const handleAddCustomizedToCart = (cartItem: CartItem) => {
    setCartItems((prev) => [...prev, cartItem]);
    showToast(`Added ${cartItem.name} to bill`);
  };

  const handleAddDealToCart = (deal: DailyDeal) => {
    const dealCartItem: CartItem = {
      cartItemId: `deal-${deal.id}-${Date.now()}`,
      dealId: deal.id,
      name: deal.title,
      category: 'deals',
      unitPrice: deal.dealPrice,
      quantity: 1,
      isDeal: true,
      dealTag: deal.tag,
      specialNote: deal.itemsIncluded.join(', ')
    };
    setCartItems((prev) => [...prev, dealCartItem]);
    showToast(`🔥 ${deal.title} added to bill!`);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
    } else {
      setCartItems((prev) =>
        prev.map((ci) => (ci.cartItemId === cartItemId ? { ...ci, quantity: newQty } : ci))
      );
    }
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear all items from the bill?')) {
      setCartItems([]);
      setAppliedCoupon('');
      setAdminDiscount({ type: 'flat', value: 0 });
      setReEnteredNotice(null);
    }
  };

  // Coupon handling
  const handleApplyCoupon = (code: string): boolean => {
    const coupon = DISCOUNT_CODES.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) return false;
    if (cartSubtotal < coupon.minOrder) return false;

    setAppliedCoupon(coupon.code);
    showToast(`Promo Code ${coupon.code} applied!`);
    return true;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    showToast('Promo code removed');
  };

  // ORDER RE-ENTRY FUNCTIONALITY:
  // Loads all items, discounts, customer information, and notes into active cart
  const handleReenterOrder = (order: OrderRecord) => {
    if (cartItems.length > 0) {
      const shouldReplace = window.confirm(
        `Active bill already has ${cartItems.length} item(s).\n\nDo you want to REPLACE the current bill with Order #${order.orderNumber} items?\n(Click OK to replace, or Cancel to append items)`
      );
      if (shouldReplace) {
        setCartItems([...order.items]);
      } else {
        setCartItems((prev) => [...prev, ...order.items]);
      }
    } else {
      setCartItems([...order.items]);
    }

    // Populate customer info
    setCustomerInfo({
      ...order.customer
    });

    // Populate applied coupon if present
    if (order.appliedCoupon) {
      setAppliedCoupon(order.appliedCoupon);
    } else {
      setAppliedCoupon('');
    }

    // Populate cashier manual discount if present
    if (order.adminDiscount) {
      setAdminDiscount({ ...order.adminDiscount });
    } else {
      setAdminDiscount({ type: 'flat', value: 0 });
    }

    // Set banner notice
    setReEnteredNotice({
      orderNumber: order.orderNumber,
      customerName: order.customer.name || 'Customer'
    });

    // Open cart drawer immediately for review and punching
    setIsCartOpen(true);
    showToast(`🔁 Order #${order.orderNumber} loaded for re-entry!`);
  };

  // Generate Bill & WhatsApp Receipt Handler
  const handleGenerateReceipt = () => {
    if (cartItems.length === 0) return;

    // Delivery Fee
    const selectedAreaObj = DELIVERY_AREAS.find((a) => a.name === customerInfo.deliveryArea);
    let baseDeliveryFee = customerInfo.orderType === 'delivery' ? (selectedAreaObj ? selectedAreaObj.fee : 50) : 0;

    // Discount
    let discountAmount = 0;
    const activeDiscountObj = DISCOUNT_CODES.find((d) => d.code === appliedCoupon);
    if (activeDiscountObj) {
      if (activeDiscountObj.type === 'percentage') {
        discountAmount = (cartSubtotal * activeDiscountObj.value) / 100;
      } else if (activeDiscountObj.type === 'flat') {
        discountAmount = Math.min(cartSubtotal, activeDiscountObj.value);
      } else if (activeDiscountObj.type === 'free_delivery') {
        baseDeliveryFee = 0;
      }
    }

    if (adminDiscount.value > 0) {
      if (adminDiscount.type === 'flat') {
        discountAmount += adminDiscount.value;
      } else {
        discountAmount += (cartSubtotal * adminDiscount.value) / 100;
      }
    }

    discountAmount = Math.min(cartSubtotal, discountAmount);
    const total = Math.max(0, cartSubtotal - discountAmount + baseDeliveryFee);

    // Build human-readable discount details
    const discountDetails = appliedCoupon
      ? `Promo Code ${appliedCoupon} (-Rs ${discountAmount})`
      : adminDiscount.value > 0
      ? `Cashier Discount ${adminDiscount.type === 'percentage' ? `${adminDiscount.value}%` : `Rs ${adminDiscount.value}`} (-Rs ${discountAmount})`
      : undefined;

    // Generate readable order ID (e.g. 1043)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}-${randomSuffix}`,
      orderNumber: `${randomSuffix}`,
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      customer: { ...customerInfo },
      items: [...cartItems],
      subtotal: cartSubtotal,
      discountAmount,
      appliedCoupon: appliedCoupon || undefined,
      adminDiscount: adminDiscount.value > 0 ? { ...adminDiscount } : undefined,
      discountDetails,
      deliveryFee: baseDeliveryFee,
      taxAmount: 0,
      total,
      status: 'pending',
      mode,
      cashierName: mode === 'admin' ? cashierName : undefined
    };

    // Save to history list
    setOrdersHistory((prev) => [newOrder, ...prev]);
    setActiveReceiptOrder(newOrder);
    setIsCartOpen(false);
    setReEnteredNotice(null);
    setIsReceiptOpen(true);
  };

  const handleConfirmAndNewOrder = () => {
    setIsReceiptOpen(false);
    setCartItems([]);
    setAppliedCoupon('');
    setAdminDiscount({ type: 'flat', value: 0 });
    setReEnteredNotice(null);
    setCustomerInfo({
      name: '',
      phone: '',
      orderType: 'delivery',
      deliveryArea: 'Pir Jo Goth Central (City)',
      customAddress: '',
      tableNumber: '',
      paymentMethod: 'cod',
      notes: ''
    });
    showToast('Order saved! Ready for next counter or delivery bill.');
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrdersHistory((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order status updated to ${status}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrdersHistory((prev) => prev.filter((o) => o.id !== orderId));
    showToast('Order record removed from history');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 pb-20">
      {/* Offline PWA Status Banner */}
      <OfflineBanner />

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-black text-amber-400 px-4 py-2 rounded-2xl shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 border border-amber-500/40 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Header */}
      <Header
        mode={mode}
        onToggleMode={setMode}
        cartCount={cartTotalItemsCount}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        orderCount={ordersHistory.length}
      />

      {/* Admin Specific Quick POS Bar (Visible when in Admin mode) */}
      {mode === 'admin' && (
        <AdminPOSBar
          cashierName={cashierName}
          onUpdateCashierName={setCashierName}
          onAddManualItem={(item) => {
            setCartItems((prev) => [...prev, item]);
            showToast(`Added "${item.name}" to bill`);
          }}
          totalOrdersToday={todayStats.count}
          totalRevenueToday={todayStats.revenue}
          recentOrders={ordersHistory}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onReEnterOrder={handleReenterOrder}
          onOpenMenuEditor={() => setIsMenuEditorOpen(true)}
        />
      )}

      {/* Category Navigation Bar */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        dealsCount={DAILY_DEALS.length}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-5 flex-1 w-full">
        {/* Search & Quick Info Bar */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              id="search-menu-input"
              placeholder="Search Zinger, Fajita Pizza, Broast, Next Cola..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:inline">⚡ Eatistan Hotline:</span>
            <span className="font-bold text-slate-900">{RESTAURANT_CONFIG.phone}</span>
            <span className="text-slate-300">•</span>
            <span>📍 {RESTAURANT_CONFIG.branch}</span>
            <span className="text-slate-300">•</span>
            <span>⏱️ 20-30m Prep</span>
          </div>
        </div>

        {/* 1. Daily Deals Showcase (Displayed when 'deals' or 'all' selected) */}
        {(activeCategory === 'deals' || (activeCategory === 'all' && !searchQuery)) && (
          <DailyDealsSection
            deals={DAILY_DEALS}
            onAddDeal={handleAddDealToCart}
            onApplyCouponCode={(code) => {
              handleApplyCoupon(code);
              setIsCartOpen(true);
            }}
            activeCoupon={appliedCoupon}
          />
        )}

        {/* 2. Menu Items Section */}
        {activeCategory !== 'deals' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 capitalize flex items-center gap-2">
                  {activeCategory === 'classic_pizza' && '🍕 Classic Hand-Tossed Pizzas'}
                  {activeCategory === 'specialty_pizza' && '🧀 Specialty & Stuffed Crust Pizzas'}
                  {activeCategory === 'burgers' && '🍔 Burgers & Crispy Zingers'}
                  {activeCategory === 'fried_chicken' && '🍗 Golden Fried Chicken & Wings'}
                  {activeCategory === 'wraps' && '🌯 Crispy Wraps & Paratha Rolls'}
                  {activeCategory === 'pasta' && '🍝 Creamy Pasta & Noodles'}
                  {activeCategory === 'sides' && '🍟 Crispy Fries, Loaded & Mayo Dips'}
                  {activeCategory === 'drinks' && '🥤 Next Cola & Chilled Beverages'}
                  {activeCategory === 'all' && '📋 All Eatistan Menu Items'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {filteredMenuItems.length} freshly prepared item{filteredMenuItems.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {filteredMenuItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6">
                <p className="font-bold text-slate-700 text-sm">No items found matching "{searchQuery}"</p>
                <p className="text-xs text-slate-400 mt-1">Try searching for Zinger, Fajita, Loaded Fries or Next Cola.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMenuItems.map((item) => {
                  const inCartQty = cartItems
                    .filter((ci) => ci.menuItemId === item.id)
                    .reduce((sum, ci) => sum + ci.quantity, 0);

                  return (
                    <MenuCard
                      key={item.id}
                      item={item}
                      quantityInCart={inCartQty}
                      onQuickAdd={handleQuickAdd}
                      onRemoveOne={handleRemoveOne}
                      onOpenCustomize={setCustomizingItem}
                    />
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Floating Bottom Action Bar for Mobile & Quick Order */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-3 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 animate-slideUp">
          <button
            type="button"
            id="floating-checkout-btn"
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-black text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-neutral-800 hover:bg-neutral-900 active:scale-98 transition-all cursor-pointer ring-1 ring-amber-500/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span>View Bill & Punch</span>
                  <span className="bg-amber-400 text-black text-[10px] px-1.5 py-0.2 rounded-full font-black">
                    {cartTotalItemsCount}
                  </span>
                </div>
                <div className="text-xs text-neutral-400">
                  {customerInfo.orderType === 'delivery' ? '🛵 Delivery' : customerInfo.orderType === 'takeaway' ? '🥡 Takeaway' : '🍽️ Dine-in'}
                  {customerInfo.name ? ` • ${customerInfo.name}` : ''}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base font-black font-mono text-amber-400">
                {formatCurrency(cartSubtotal)}
              </span>
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
      )}

      {/* Item Customization Modal */}
      {customizingItem && (
        <ItemCustomizeModal
          item={customizingItem}
          isOpen={Boolean(customizingItem)}
          onClose={() => setCustomizingItem(null)}
          onAddToCart={handleAddCustomizedToCart}
        />
      )}

      {/* Cart & Checkout Sheet (Includes Daily Deals, Discounts, Customer Details, Delivery Area & Re-Entry Notice) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        customerInfo={customerInfo}
        onUpdateCustomerInfo={(info) => setCustomerInfo((prev) => ({ ...prev, ...info }))}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        adminDiscount={adminDiscount}
        onUpdateAdminDiscount={setAdminDiscount}
        mode={mode}
        onGenerateReceipt={handleGenerateReceipt}
        reEnteredOrderNotice={reEnteredNotice}
        onDismissReEnterNotice={() => setReEnteredNotice(null)}
        onUpdateCartItem={handleUpdateCartItem}
        onAddManualItem={(item) => {
          setCartItems((prev) => [...prev, item]);
          showToast(`Added "${item.name}" to bill`);
        }}
        editingOrderRecord={editingOrder}
        onCancelEditingOrder={handleCancelEditingOrder}
        onSaveEditedOrder={handleSaveEditedOrder}
      />

      {/* Generated Bill & WhatsApp Receipt Modal */}
      {isReceiptOpen && activeReceiptOrder && (
        <ReceiptModal
          order={activeReceiptOrder}
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          onConfirmAndNewOrder={handleConfirmAndNewOrder}
          onReEnterOrder={handleReenterOrder}
        />
      )}

      {/* Order History / Sales Register Modal with Fast Re-Entry & Past Order Editing */}
      {isHistoryOpen && (
        <OrderHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          orders={ordersHistory}
          onSelectOrder={(order) => {
            setActiveReceiptOrder(order);
            setIsReceiptOpen(true);
          }}
          onReEnterOrder={handleReenterOrder}
          onEditOrder={handleStartEditingOrder}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onDeleteOrder={handleDeleteOrder}
          onClearHistory={() => {
            if (window.confirm('Clear all orders history?')) {
              setOrdersHistory([]);
              showToast('Orders history cleared');
            }
          }}
        />
      )}

      {/* Menu Catalog & Prices Editor Modal (Offline LocalStorage Persisted) */}
      {isMenuEditorOpen && (
        <MenuEditorModal
          isOpen={isMenuEditorOpen}
          onClose={() => setIsMenuEditorOpen(false)}
          menuItems={menuCatalog}
          onUpdateItem={handleUpdateMenuItem}
          onAddItem={handleAddMenuItem}
          onDeleteItem={handleDeleteMenuItem}
          onResetToDefault={handleResetMenuToDefault}
        />
      )}
    </div>
  );
}
