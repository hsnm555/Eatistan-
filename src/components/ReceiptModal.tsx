import React, { useState } from 'react';
import { OrderRecord } from '../types';
import {
  X, Printer, Check, Copy, MessageCircle, ArrowRight,
  Share2, Bike, UtensilsCrossed, PackageOpen, CheckCircle2, RotateCcw
} from 'lucide-react';
import {
  formatCurrency,
  generateWhatsAppReceiptText,
  buildWhatsAppLink,
  copyReceiptToClipboard
} from '../utils/receiptGenerator';
import { RESTAURANT_CONFIG } from '../data/menuData';

interface ReceiptModalProps {
  order: OrderRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAndNewOrder: () => void;
  onReEnterOrder?: (order: OrderRecord) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
  onConfirmAndNewOrder,
  onReEnterOrder
}) => {
  const [copied, setCopied] = useState(false);
  const [viewTab, setViewTab] = useState<'bill' | 'whatsapp_text'>('bill');

  if (!isOpen || !order) return null;

  const handleCopy = async () => {
    const ok = await copyReceiptToClipboard(order);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsAppUrl = buildWhatsAppLink(order);
  const whatsAppRawText = generateWhatsAppReceiptText(order);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col my-auto max-h-[95vh]">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base leading-none">
                Bill & WhatsApp Receipt Generated
              </h2>
              <span className="text-xs text-slate-400 mt-0.5 block font-mono">
                Order #{order.orderNumber} • {order.customer.orderType.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher: Visual Bill vs WhatsApp Text */}
            <div className="bg-slate-800 p-0.5 rounded-lg text-xs flex border border-slate-700">
              <button
                type="button"
                onClick={() => setViewTab('bill')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  viewTab === 'bill' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Visual Bill
              </button>
              <button
                type="button"
                onClick={() => setViewTab('whatsapp_text')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  viewTab === 'whatsapp_text' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                WhatsApp Text
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
          {viewTab === 'bill' ? (
            /* Visual Printable Bill Container */
            <div
              id="thermal-receipt-container"
              className="bg-white rounded-2xl border border-slate-300 shadow-md p-5 sm:p-6 max-w-md mx-auto text-slate-800 font-sans"
            >
              {/* Restaurant Header */}
              <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
                <div className="w-12 h-12 mx-auto rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-xl mb-1.5 shadow-sm">
                  ZK
                </div>
                <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">
                  {RESTAURANT_CONFIG.name}
                </h3>
                <p className="text-xs text-slate-500">{RESTAURANT_CONFIG.address}</p>
                <p className="text-xs text-slate-500 font-medium">
                  Tel: {RESTAURANT_CONFIG.phone} • {RESTAURANT_CONFIG.timings}
                </p>
              </div>

              {/* Order Metadata */}
              <div className="py-3 text-xs space-y-1 border-b border-dashed border-slate-300">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Receipt No:</span>
                  <span className="font-bold text-slate-900">#{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="text-slate-800 font-medium">{order.dateFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Order Mode:</span>
                  <span className="font-bold uppercase text-slate-900">
                    {order.customer.orderType === 'delivery'
                      ? '🛵 Home Delivery'
                      : order.customer.orderType === 'takeaway'
                      ? '🥡 Takeaway'
                      : '🍽️ Dine-In'}
                  </span>
                </div>
                {order.cashierName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cashier:</span>
                    <span className="text-slate-800">{order.cashierName}</span>
                  </div>
                )}
              </div>

              {/* Customer Details Box */}
              <div className="py-3 bg-amber-50/50 -mx-2 px-3 rounded-xl my-2 border border-amber-200/60 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">Customer Name:</span>
                  <span className="font-black text-slate-900">{order.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">WhatsApp Phone:</span>
                  <span className="font-mono font-bold text-emerald-800">{order.customer.phone}</span>
                </div>
                {order.customer.orderType === 'delivery' && (
                  <>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-700">Delivery Area:</span>
                      <span className="font-semibold text-slate-900">{order.customer.deliveryArea}</span>
                    </div>
                    {order.customer.customAddress && (
                      <div className="pt-1 text-[11px] text-slate-600 border-t border-amber-200/40">
                        <span className="font-semibold">Address: </span>
                        {order.customer.customAddress}
                      </div>
                    )}
                  </>
                )}
                {order.customer.orderType === 'dinein' && order.customer.tableNumber && (
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-700">Table:</span>
                    <span className="font-bold text-slate-900">{order.customer.tableNumber}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="py-3 border-b-2 border-dashed border-slate-300">
                <div className="text-[11px] font-bold uppercase text-slate-400 pb-1.5 border-b border-slate-200 flex justify-between">
                  <span>Item Description</span>
                  <span>Amount</span>
                </div>

                <div className="divide-y divide-slate-100 py-1 space-y-1.5">
                  {order.items.map((item, idx) => {
                    const lineTotal = item.unitPrice * item.quantity;
                    return (
                      <div key={idx} className="pt-1.5 text-xs">
                        <div className="flex justify-between items-start font-semibold text-slate-900">
                          <span>
                            {item.quantity}x {item.name}
                            {item.selectedSize && ` (${item.selectedSize})`}
                          </span>
                          <span className="font-mono font-bold">{formatCurrency(lineTotal)}</span>
                        </div>
                        {item.selectedSpice && (
                          <div className="text-[10px] text-red-600 pl-3">
                            🌶️ {item.selectedSpice}
                          </div>
                        )}
                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                          <div className="text-[10px] text-slate-500 pl-3">
                            +{item.selectedAddons.map((a) => a.name).join(', ')}
                          </div>
                        )}
                        {item.specialNote && (
                          <div className="text-[10px] text-slate-400 italic pl-3">
                            Note: {item.specialNote}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Calculation Summary */}
              <div className="py-3 text-xs space-y-1.5 border-b border-dashed border-slate-300">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatCurrency(order.subtotal)}</span>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>
                      Discount{order.appliedCoupon ? ` (${order.appliedCoupon})` : ''}:
                    </span>
                    <span className="font-mono">-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}

                {order.customer.orderType === 'delivery' && (
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charges:</span>
                    <span className="font-mono">
                      {order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}
                    </span>
                  </div>
                )}

                {order.taxAmount > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>GST / Tax:</span>
                    <span className="font-mono">{formatCurrency(order.taxAmount)}</span>
                  </div>
                )}

                <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-baseline font-black">
                  <span className="text-sm uppercase text-slate-900">GRAND TOTAL:</span>
                  <span className="text-xl text-slate-950 font-mono">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              {/* Payment & Footer */}
              <div className="pt-3 text-center text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">
                  Payment: {order.customer.paymentMethod.toUpperCase()}
                </p>
                {order.customer.notes && (
                  <p className="text-[11px] text-slate-600 italic">
                    Special Note: "{order.customer.notes}"
                  </p>
                )}
                <p className="text-[11px] pt-1 text-slate-400">
                  ✨ Thank you for choosing {RESTAURANT_CONFIG.name}! ✨
                </p>
              </div>
            </div>
          ) : (
            /* WhatsApp Raw Text Copy Box */
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner border border-slate-800">
              {whatsAppRawText}
            </div>
          )}
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col gap-3">
          {/* WhatsApp & Copy Action Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Direct WhatsApp Open Button */}
            <a
              id="btn-open-whatsapp"
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Send via WhatsApp</span>
            </a>

            {/* Copy WhatsApp Text */}
            <button
              type="button"
              id="btn-copy-receipt"
              onClick={handleCopy}
              className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Receipt Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy WhatsApp Receipt Text</span>
                </>
              )}
            </button>
          </div>

          {/* Print, Re-Enter & New Order Secondary Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-print-receipt"
                onClick={handlePrint}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Slip (Thermal POS)</span>
              </button>

              {onReEnterOrder && (
                <button
                  type="button"
                  id="btn-re-enter-from-receipt"
                  onClick={() => {
                    onClose();
                    onReEnterOrder(order);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Re-enter items and customer details from this receipt into POS cart"
                >
                  <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Re-Enter in POS</span>
                </button>
              )}
            </div>

            <button
              type="button"
              id="btn-confirm-new-order"
              onClick={onConfirmAndNewOrder}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <span>Save & Place Next Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
