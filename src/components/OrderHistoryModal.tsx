import React, { useState, useMemo } from 'react';
import { OrderRecord, OrderStatus, OrderType } from '../types';
import { 
  X, Search, MessageCircle, Printer, Eye, Trash2, Clock, 
  RotateCcw, CheckCircle2, AlertCircle, Phone, MapPin, 
  Tag, User, Calendar, ArrowRight, DollarSign, Filter, Sparkles, RefreshCw, Edit2
} from 'lucide-react';
import { formatCurrency, buildWhatsAppLink, copyReceiptToClipboard } from '../utils/receiptGenerator';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
  onSelectOrder: (order: OrderRecord) => void;
  onReEnterOrder: (order: OrderRecord) => void;
  onEditOrder: (order: OrderRecord) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onClearHistory: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
  onReEnterOrder,
  onEditOrder,
  onUpdateOrderStatus,
  onDeleteOrder,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday'>('all');
  const [selectedOrderIdForDetails, setSelectedOrderIdForDetails] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Filtered orders calculation
  const filteredOrders = useMemo(() => {
    if (!isOpen) return [];
    const todayStr = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    return orders.filter((order) => {
      // 1. Search filter
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(q) ||
        order.customer.name.toLowerCase().includes(q) ||
        order.customer.phone.includes(q) ||
        order.customer.customAddress.toLowerCase().includes(q) ||
        order.customer.deliveryArea.toLowerCase().includes(q) ||
        order.customer.tableNumber.toLowerCase().includes(q) ||
        order.items.some((i) => i.name.toLowerCase().includes(q));

      // 2. Status filter
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      // 3. Order type filter
      const matchesType = orderTypeFilter === 'all' || order.customer.orderType === orderTypeFilter;

      // 4. Date filter
      const orderDateStr = new Date(order.timestamp).toDateString();
      let matchesDate = true;
      if (dateFilter === 'today') {
        matchesDate = orderDateStr === todayStr;
      } else if (dateFilter === 'yesterday') {
        matchesDate = orderDateStr === yesterdayStr;
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, orderTypeFilter, dateFilter, isOpen]);

  // Statistics
  const stats = useMemo(() => {
    const totalCount = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const totalDiscountsGiven = orders.reduce((sum, o) => sum + (o.discountAmount || 0), 0);
    return { totalCount, totalSales, totalDiscountsGiven };
  }, [orders]);

  if (!isOpen) return null;

  const handleCopyReceipt = async (order: OrderRecord) => {
    const ok = await copyReceiptToClipboard(order);
    if (ok) {
      setCopiedOrderId(order.id);
      setTimeout(() => setCopiedOrderId(null), 2000);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Pending
          </span>
        );
      case 'preparing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            In Kitchen
          </span>
        );
      case 'dispatched':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            Out for Delivery
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Delivered / Paid
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Top Header with Brand */}
        <div className="p-4 sm:p-5 bg-black text-amber-500 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-lg shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white tracking-wide">
                  Order History & POS Re-Entry
                </h2>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Admin Register
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Select any previous order to view full bill details or instantly re-enter into active cart.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {orders.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all order records from local storage?')) {
                    onClearHistory();
                  }
                }}
                className="text-xs text-neutral-400 hover:text-red-400 font-semibold px-2 py-1 transition-colors"
                title="Clear all stored order history"
              >
                Clear All Logs
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick KPI Stats Strip */}
        <div className="bg-neutral-900 px-4 py-2.5 text-neutral-300 text-xs border-b border-neutral-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-mono">
              <span className="text-neutral-500">Total Orders:</span>
              <strong className="text-white">{stats.totalCount}</strong>
            </span>
            <span className="flex items-center gap-1 font-mono">
              <span className="text-neutral-500">Gross Sales:</span>
              <strong className="text-amber-400">{formatCurrency(stats.totalSales)}</strong>
            </span>
            <span className="flex items-center gap-1 font-mono hidden sm:inline-flex">
              <span className="text-neutral-500">Discounts Saved:</span>
              <strong className="text-emerald-400">{formatCurrency(stats.totalDiscountsGiven)}</strong>
            </span>
          </div>

          <div className="text-[11px] text-amber-300/90 font-semibold flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Click "Re-Enter" on any order to populate active bill</span>
          </div>
        </div>

        {/* Search & Multi-Filter Controls */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col gap-2.5">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                id="search-order-history-input"
                placeholder="Search by customer name, phone, order # (e.g. 1042), address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Date filter pills */}
            <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl shrink-0 self-start sm:self-auto">
              {(['all', 'today', 'yesterday'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDateFilter(d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                    dateFilter === d
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Status & Order Type Filters */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-200/70">
            {/* Status pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">Status:</span>
              {[
                { id: 'all', label: 'All Status' },
                { id: 'pending', label: 'Pending' },
                { id: 'preparing', label: 'Kitchen' },
                { id: 'dispatched', label: 'Dispatched' },
                { id: 'completed', label: 'Delivered/Paid' },
                { id: 'cancelled', label: 'Cancelled' }
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    statusFilter === st.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Order type pills */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-slate-500 mr-1 hidden md:inline">Type:</span>
              {[
                { id: 'all', label: 'All Types' },
                { id: 'delivery', label: '🛵 Delivery' },
                { id: 'takeaway', label: '🥡 Takeaway' },
                { id: 'dinein', label: '🍽️ Dine-In' }
              ].map((ot) => (
                <button
                  key={ot.id}
                  type="button"
                  onClick={() => setOrderTypeFilter(ot.id)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                    orderTypeFilter === ot.id
                      ? 'bg-amber-500 text-black'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {ot.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List / Cards */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-slate-100">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
              <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <h3 className="font-bold text-slate-800 text-base">No orders matched your filters</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try clearing search terms or status filters. Once an order is punched, it will appear here permanently for quick re-entry.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setOrderTypeFilter('all');
                  setDateFilter('all');
                }}
                className="mt-4 px-4 py-1.5 bg-amber-500 text-black rounded-xl text-xs font-bold hover:bg-amber-600 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const waLink = buildWhatsAppLink(order);
              const isExpanded = selectedOrderIdForDetails === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3"
                >
                  {/* Top Row: Order #, Status, Mode/Cashier, Timestamp */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        #{order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                        {order.customer.orderType === 'delivery' && '🛵 Delivery'}
                        {order.customer.orderType === 'takeaway' && '🥡 Takeaway'}
                        {order.customer.orderType === 'dinein' && `🍽️ Dine-In ${order.customer.tableNumber ? `(${order.customer.tableNumber})` : ''}`}
                      </span>
                      {order.cashierName && (
                        <span className="text-[10px] text-slate-500 font-medium">
                          Billed by: <strong className="text-slate-700">{order.cashierName}</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.dateFormatted}</span>
                    </div>
                  </div>

                  {/* Middle Row: Customer Info & Items Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                    {/* Customer Information Column (5 cols) */}
                    <div className="md:col-span-5 space-y-1 text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                        <User className="w-3.5 h-3.5 text-amber-600" />
                        <span>{order.customer.name || 'Walk-in Customer'}</span>
                        {order.customer.phone && (
                          <span className="font-mono text-xs font-normal text-slate-500">
                            ({order.customer.phone})
                          </span>
                        )}
                      </div>

                      {order.customer.orderType === 'delivery' && (
                        <div className="text-slate-600 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>{order.customer.deliveryArea}</strong>
                            {order.customer.customAddress ? `: ${order.customer.customAddress}` : ''}
                          </span>
                        </div>
                      )}

                      {order.customer.orderType === 'dinein' && order.customer.tableNumber && (
                        <div className="text-slate-600">
                          Table: <strong className="text-slate-800">{order.customer.tableNumber}</strong>
                        </div>
                      )}

                      <div className="text-[11px] text-slate-500">
                        Payment: <span className="font-semibold text-slate-700 uppercase">{order.customer.paymentMethod}</span>
                      </div>

                      {order.customer.notes && (
                        <div className="text-[11px] text-amber-800 bg-amber-50/80 p-1.5 rounded-lg border border-amber-100">
                          📝 <em>"{order.customer.notes}"</em>
                        </div>
                      )}
                    </div>

                    {/* Items & Discounts Column (7 cols) */}
                    <div className="md:col-span-7 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Items Ordered ({order.items.length}):</span>
                        <button
                          type="button"
                          onClick={() => setSelectedOrderIdForDetails(isExpanded ? null : order.id)}
                          className="text-[11px] text-amber-600 hover:text-amber-700 font-semibold underline cursor-pointer"
                        >
                          {isExpanded ? 'Hide Item List' : 'View Itemized List'}
                        </button>
                      </div>

                      {/* Items previews / full list */}
                      {isExpanded ? (
                        <div className="space-y-1 pt-1 text-xs border-t border-slate-200 max-h-40 overflow-y-auto">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center text-slate-800 py-0.5">
                              <div>
                                <span className="font-bold text-slate-900">{it.quantity}x</span> {it.name}
                                {it.selectedSize && <span className="text-[11px] text-slate-500 font-medium"> ({it.selectedSize})</span>}
                              </div>
                              <span className="font-mono font-semibold text-slate-700">
                                {formatCurrency(it.unitPrice * it.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-700 leading-snug">
                          {order.items.map((it, idx) => (
                            <span key={idx}>
                              <strong>{it.quantity}x</strong> {it.name}
                              {it.selectedSize ? ` (${it.selectedSize})` : ''}
                              {idx < order.items.length - 1 ? ' • ' : ''}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Applied Discounts breakdown */}
                      {order.discountAmount > 0 && (
                        <div className="pt-1.5 border-t border-dashed border-slate-200 flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 font-semibold text-emerald-700">
                            <Tag className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Discount Applied:</span>
                            {order.appliedCoupon && (
                              <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded text-[10px] font-mono font-black uppercase">
                                {order.appliedCoupon}
                              </span>
                            )}
                            {order.discountDetails && !order.appliedCoupon && (
                              <span className="text-slate-500 text-[10px]">({order.discountDetails})</span>
                            )}
                          </span>
                          <span className="font-mono font-bold text-emerald-700">
                            -{formatCurrency(order.discountAmount)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row: Financial Totals, Status Changer & Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Total Breakdown */}
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Bill</span>
                        <span className="text-lg font-black font-mono text-slate-950">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 pl-2 border-l border-slate-200">
                        <span>Subtotal: {formatCurrency(order.subtotal)}</span>
                        {order.deliveryFee > 0 && (
                          <span> • Delivery: {formatCurrency(order.deliveryFee)}</span>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Status changer dropdown */}
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="text-xs font-bold bg-slate-100 border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Update order progress status"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="preparing">🍳 In Kitchen</option>
                        <option value="dispatched">🛵 Out for Delivery</option>
                        <option value="completed">✅ Delivered / Paid</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>

                      {/* WhatsApp Button */}
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors cursor-pointer"
                        title="Open WhatsApp Receipt"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      {/* View Bill / Thermal Slip Button */}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectOrder(order);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        title="View Full Bill & Print 80mm Thermal Slip"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Slip</span>
                      </button>

                      {/* EDIT ORDER BUTTON */}
                      <button
                        type="button"
                        id={`edit-order-${order.orderNumber}`}
                        onClick={() => {
                          onEditOrder(order);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer hover:border-amber-400"
                        title="Edit items, customer info, price or notes in this order record"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit Order</span>
                      </button>

                      {/* RE-ENTER ORDER BUTTON (The Primary User Feature!) */}
                      <button
                        type="button"
                        id={`re-enter-order-${order.orderNumber}`}
                        onClick={() => {
                          onReEnterOrder(order);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-extrabold shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ring-1 ring-amber-600/30"
                        title="Re-enter items, customer info & discount into active POS cart"
                      >
                        <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Re-Enter</span>
                      </button>

                      {/* Delete single order */}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete record for Order #${order.orderNumber}?`)) {
                            onDeleteOrder(order.id);
                          }
                        }}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete this order record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
