import { OrderRecord } from '../types';
import { RESTAURANT_CONFIG } from '../data/menuData';

export function formatCurrency(amount: number): string {
  return `${RESTAURANT_CONFIG.currency} ${Math.round(amount).toLocaleString('en-US')}`;
}

export function sanitizePhoneForWhatsApp(phone: string): string {
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');
  
  // If starts with 0 (e.g. 03001234567), convert to standard 923001234567 for Pakistan
  if (digits.startsWith('0') && digits.length === 11) {
    digits = '92' + digits.substring(1);
  } else if (!digits.startsWith('92') && digits.length === 10) {
    digits = '92' + digits;
  }
  
  return digits;
}

export function generateWhatsAppReceiptText(order: OrderRecord): string {
  const dateStr = order.dateFormatted || new Date(order.timestamp).toLocaleString();
  
  let lines: string[] = [];
  
  lines.push(`🍔 *${RESTAURANT_CONFIG.name.toUpperCase()}* 🍕`);
  lines.push(`*${RESTAURANT_CONFIG.tagline}*`);
  lines.push(`📍 ${RESTAURANT_CONFIG.address}`);
  lines.push(`📞 Phone / Helpline: ${RESTAURANT_CONFIG.phone}`);
  lines.push(`══════════════════════`);
  lines.push(`🧾 *OFFICIAL BILL & RECEIPT*`);
  lines.push(`🆔 *Order ID:* #${order.orderNumber}`);
  lines.push(`📅 *Date & Time:* ${dateStr}`);
  lines.push(`──────────────────────`);
  
  // Customer & Delivery Information
  lines.push(`👤 *Customer Name:* ${order.customer.name || 'Valued Customer'}`);
  if (order.customer.phone) {
    lines.push(`📱 *Contact / WA:* ${order.customer.phone}`);
  }
  
  const orderTypeLabel = 
    order.customer.orderType === 'delivery' ? '🛵 Home Delivery' :
    order.customer.orderType === 'takeaway' ? '🥡 Takeaway / Self Pickup' : '🍽️ Dine-In (Table Service)';
  
  lines.push(`📦 *Order Type:* ${orderTypeLabel}`);
  
  if (order.customer.orderType === 'delivery') {
    lines.push(`📍 *Delivery Area:* ${order.customer.deliveryArea || 'Standard Area'}`);
    if (order.customer.customAddress) {
      lines.push(`🏠 *Address:* ${order.customer.customAddress}`);
    }
  } else if (order.customer.orderType === 'dinein' && order.customer.tableNumber) {
    lines.push(`🪑 *Table Number:* ${order.customer.tableNumber}`);
  }
  
  const paymentLabels: Record<string, string> = {
    cod: 'Cash on Delivery (COD)',
    easypaisa: 'Easypaisa Transfer',
    jazzcash: 'JazzCash Transfer',
    bank_transfer: 'Online Bank Transfer',
    card: 'Credit / Debit Card'
  };
  lines.push(`💳 *Payment:* ${paymentLabels[order.customer.paymentMethod] || 'Cash'}`);
  
  if (order.cashierName && order.mode === 'admin') {
    lines.push(`👨‍🍳 *Billed By (Admin):* ${order.cashierName}`);
  }

  lines.push(`══════════════════════`);
  lines.push(`🍽️ *ORDER ITEMS:*`);
  
  order.items.forEach((item, idx) => {
    const itemTotal = item.unitPrice * item.quantity;
    let itemLine = `${idx + 1}. *${item.quantity}x ${item.name}*`;
    if (item.selectedSize) {
      itemLine += ` (${item.selectedSize})`;
    }
    itemLine += ` ➔ ${formatCurrency(itemTotal)}`;
    lines.push(itemLine);
    
    if (item.selectedSpice) {
      lines.push(`   🌶️ Spice: ${item.selectedSpice}`);
    }
    if (item.selectedAddons && item.selectedAddons.length > 0) {
      const addonsStr = item.selectedAddons.map(a => `${a.name} (+${formatCurrency(a.price)})`).join(', ');
      lines.push(`   ➕ Addons: ${addonsStr}`);
    }
    if (item.specialNote) {
      lines.push(`   📝 Note: ${item.specialNote}`);
    }
  });

  lines.push(`──────────────────────`);
  lines.push(`*Subtotal:* ${formatCurrency(order.subtotal)}`);
  
  if (order.discountAmount > 0) {
    lines.push(`*Discount Applied${order.appliedCoupon ? ` (${order.appliedCoupon})` : ''}:* -${formatCurrency(order.discountAmount)}`);
  }
  
  if (order.customer.orderType === 'delivery') {
    lines.push(`*Delivery Charges:* ${order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}`);
  }
  
  if (order.taxAmount > 0) {
    lines.push(`*Govt Tax / GST:* ${formatCurrency(order.taxAmount)}`);
  }
  
  lines.push(`══════════════════════`);
  lines.push(`💰 *GRAND TOTAL:* *${formatCurrency(order.total)}*`);
  lines.push(`══════════════════════`);
  
  if (order.customer.notes) {
    lines.push(`💬 *Special Instructions:* ${order.customer.notes}`);
  }
  
  lines.push(`\n✨ *Thank you for dining with ${RESTAURANT_CONFIG.name}!*`);
  lines.push(`🚀 Freshly prepared & served with love.`);
  lines.push(`For changes or feedback, reply directly to this chat.`);

  return lines.join('\n');
}

export function buildWhatsAppLink(order: OrderRecord, targetPhone?: string): string {
  const receiptText = generateWhatsAppReceiptText(order);
  const encodedText = encodeURIComponent(receiptText);
  
  const phoneToUse = targetPhone || order.customer.phone;
  if (phoneToUse && phoneToUse.trim()) {
    const sanitized = sanitizePhoneForWhatsApp(phoneToUse);
    return `https://wa.me/${sanitized}?text=${encodedText}`;
  }
  
  // Fallback to sending to restaurant or open WhatsApp share sheet
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

export async function copyReceiptToClipboard(order: OrderRecord): Promise<boolean> {
  const text = generateWhatsAppReceiptText(order);
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}
